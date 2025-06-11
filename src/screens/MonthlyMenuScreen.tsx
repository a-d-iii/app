import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../data/meals';

// Fallback data bundled with the app for offline use
import localMenu from '../../monthly-menu-may-2025.json';



const MENU_URL = 'https://raw.githubusercontent.com/a-d-iii/app/main/monthly-menu-may-2025.json';


interface MonthlyMenu {
  [date: string]: Meal[];
}

type WeekSection = { title: string; data: { date: string; meals: Meal[] }[] };

export default function MonthlyMenuScreen() {

  // Use the bundled data initially so the monthly view works offline
  const [menu, setMenu] = useState<MonthlyMenu>(localMenu as MonthlyMenu);


  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const listRef = useRef<SectionList<any>>(null);
  const scrollTarget = useRef<{ sectionIndex: number; itemIndex: number }>();

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const cached = await AsyncStorage.getItem('monthlyMenu');
        if (cached) {
          setMenu(JSON.parse(cached));
        }
        const resp = await fetch(MENU_URL);
        if (resp.ok) {
          const json = await resp.json();
          setMenu(json);
          await AsyncStorage.setItem('monthlyMenu', JSON.stringify(json));
        }
      } catch (e) {
        console.error('Failed to load menu', e);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  // Scroll to current day once data is loaded
  useEffect(() => {
    if (loading) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const dates = Object.keys(menu).sort();
    const idx = dates.indexOf(todayKey);
    if (idx >= 0) {
      scrollTarget.current = {
        sectionIndex: Math.floor(idx / 7),
        itemIndex: idx % 7,
      };
      setTimeout(() => {
        if (scrollTarget.current) {
          listRef.current?.scrollToLocation({
            ...scrollTarget.current,
            animated: false,
            viewPosition: 0,
          });
        }
      }, 0);
    }
  }, [loading, menu]);

  const handleScrollToIndexFailed = () => {
    if (!scrollTarget.current) return;
    setTimeout(() => {
      listRef.current?.scrollToLocation({
        ...scrollTarget.current!,
        animated: false,
        viewPosition: 0,
      });
    }, 50);
  };

  const toWeeks = (): WeekSection[] => {

    if (!menu) return [];

    const dates = Object.keys(menu).sort();
    const weeks: WeekSection[] = [];
    for (let i = 0; i < dates.length; i += 7) {
      const slice = dates.slice(i, i + 7);
      weeks.push({
        title: `Week ${weeks.length + 1}`,
        data: slice.map(d => ({ date: d, meals: menu[d] }))
      });
    }
    return weeks;
  };

  const today = new Date().toISOString().slice(0, 10);

  const toggleLike = (key: string) =>
    setLikes((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderDay = (
    { date, meals }: { date: string; meals: Meal[] },
    index: number,
    section: WeekSection
  ) => {
    const isPast = date < today;
    return (
      <View
        style={[
          styles.dayBlock,
          isPast && styles.pastDay,
          index === 0 && styles.firstDay,
          index === section.data.length - 1 && styles.lastDay,
        ]}
      >
        <View style={styles.dateChip}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        {meals.map((m) => {
          const key = `${date}-${m.name}`;
          return (
            <View key={key} style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealTitle}>{m.name}</Text>
                <View style={styles.mealActions}>
                  <Pressable
                    onPress={() => toggleLike(key)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={likes[key] ? 'heart' : 'heart-outline'}
                      size={16}
                      color={likes[key] ? 'red' : '#333'}
                    />
                  </Pressable>
                  <Pressable style={styles.iconButton}>
                    <Ionicons name="add" size={16} color="#333" />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.mealItems}>{m.items.join(', ')}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <SectionList
        ref={listRef}
        sections={toWeeks()}
        keyExtractor={(item) => item.date}
        renderItem={({ item, index, section }) =>
          renderDay(item, index, section as WeekSection)
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.weekHeader}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        SectionSeparatorComponent={() => <View style={{ height: 12 }} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9f9f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 12 },
  weekHeader: {
    backgroundColor: '#e6e6e6',
    padding: 8,
    marginHorizontal: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  sectionHeader: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333',
  },
  dayBlock: {
    backgroundColor: '#dcdcdc',
    padding: 12,
    marginHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bbb',
  },
  firstDay: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  lastDay: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
  },
  dateChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#c0c0c0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    marginBottom: 6,
  },
  dateText: { fontWeight: '600' },
  mealItem: { marginBottom: 8 },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  mealActions: { flexDirection: 'row' },
  iconButton: { marginLeft: 8 },
  mealTitle: { fontWeight: '600' },
  mealItems: { color: '#555' },
  pastDay: { opacity: 0.5 },
});
