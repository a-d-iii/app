import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../data/meals';
// Fallback data bundled with the app for offline use
import localMenu from '../../monthly-menu-may-2025.json';

const MENU_URL =
  'https://raw.githubusercontent.com/a-d-iii/app/main/monthly-menu-may-2025.json';

interface MonthlyMenu {
  [date: string]: Meal[];
}

type WeekSection = { title: string; data: { date: string; meals: Meal[] }[] };

export default function MonthlyMenuScreen() {
  // Use the bundled data initially so the monthly view works offline
  const [menu, setMenu] = useState<MonthlyMenu>(localMenu as MonthlyMenu);
  const [loading, setLoading] = useState(true);

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

  const toWeeks = (): WeekSection[] => {
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

  const renderDay = ({ date, meals }: { date: string; meals: Meal[] }) => (
    <View style={styles.dayBlock}>
      <Text style={styles.dayHeader}>{date}</Text>
      {meals.map(m => (
        <View key={`${date}-${m.name}`} style={styles.mealItem}>
          <Text style={styles.mealTitle}>{m.name}</Text>
          <Text style={styles.mealItems}>{m.items.join(', ')}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SectionList
      sections={toWeeks()}
      keyExtractor={(item) => item.date}
      renderItem={({ item }) => renderDay(item)}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    fontWeight: '600',
  },
  dayBlock: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  mealItem: {
    marginBottom: 4,
  },
  mealTitle: {
    fontWeight: '600',
  },
  mealItems: {
    color: '#555',
  },
});
