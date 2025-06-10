// src/screens/FoodMenuScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RatingModal from '../components/RatingModal';
import Ionicons from '@expo/vector-icons/Ionicons';

import { MEALS } from '../data/meals';

const { width } = Dimensions.get('window');

const MEAL_ICONS: { [name: string]: string } = {
  Breakfast: 'cafe-outline',
  Lunch: 'restaurant-outline',
  Snacks: 'fast-food-outline',
  Dinner: 'moon-outline',
};

// Pad numbers to two digits without relying on ES2017 String.padStart
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatTime(h: number, m: number) {
  return `${pad(h)}:${pad(m)}`;
}

type Ratings = { [key: string]: number };
type Favorites = { [key: string]: boolean };

export default function FoodMenuScreen({ navigation }: any) {
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const [ratings, setRatings] = useState<Ratings>({});
  const [timers, setTimers] = useState<{ [name: string]: string }>({});
  const [statuses, setStatuses] = useState<{ [name: string]: 'ongoing' | 'next' | 'later' }>({});
  const [modalItem, setModalItem] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorites>({});

  useEffect(() => {
    AsyncStorage.getItem('mealRatings').then((raw) => {
      if (raw) setRatings(JSON.parse(raw));
    });
    AsyncStorage.getItem('mealFavorites').then((raw) => {
      if (raw) setFavorites(JSON.parse(raw));
    });
  }, []);

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      let nextIdx = -1;
      MEALS.forEach((m, idx) => {
        const start = new Date();
        start.setHours(m.startHour, m.startMinute, 0, 0);
        if (start > now && nextIdx === -1) nextIdx = idx;
      });
      MEALS.forEach((m, idx) => {
        const start = new Date();
        const end = new Date();
        start.setHours(m.startHour, m.startMinute, 0, 0);
        end.setHours(m.endHour, m.endMinute, 0, 0);

        let status: 'ongoing' | 'next' | 'later' = 'later';
        if (now >= start && now < end) status = 'ongoing';
        else if (idx === nextIdx) status = 'next';

        const toStart = start.getTime() - now.getTime();
        const toEnd = end.getTime() - now.getTime();
        const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

        let label = '';
        if (toStart > 0) {
          const secs = Math.floor(toStart / 1000);
          const hrs = Math.floor(secs / 3600);
          const mins = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          label = `${pad2(hrs)}:${pad2(mins)}:${pad2(s)} to start`;
        } else if (toEnd > 0) {
          const secs = Math.floor(toEnd / 1000);
          const hrs = Math.floor(secs / 3600);
          const mins = Math.floor((secs % 3600) / 60);
          const s = secs % 60;
          label = `${pad2(hrs)}:${pad2(mins)}:${pad2(s)} left`;
        } else {
          label = 'Ended';
        }

        setTimers((t) => ({ ...t, [m.name]: label }));
        setStatuses((s2) => ({ ...s2, [m.name]: status }));
      });
    };
    updateTimers();
    const id = setInterval(updateTimers, 1000);
    return () => clearInterval(id);
  }, []);

  const openModal = (itemKey: string) => setModalItem(itemKey);
  const closeModal = () => setModalItem(null);
  const submitRating = async (itemKey: string, rating: number) => {
    const updated = { ...ratings, [itemKey]: rating };
    setRatings(updated);
    await AsyncStorage.setItem('mealRatings', JSON.stringify(updated));
  };

  const toggleFavorite = async (itemKey: string) => {
    const updated = { ...favorites, [itemKey]: !favorites[itemKey] };
    setFavorites(updated);
    await AsyncStorage.setItem('mealFavorites', JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap} pointerEvents="none">
          <Text style={styles.title}>Full Day’s Menu</Text>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {MEALS.map((meal) => {
          const timer = timers[meal.name] || '';
          const status = statuses[meal.name];
          return (
            <Animated.View
              key={meal.name}
              style={[
                styles.mealBlock,
                status === 'ongoing' && styles.ongoing,
                status === 'next' && styles.next,
              ]}
            >
              <View style={styles.mealHeaderRow}>
                <View style={styles.mealHeaderLeft}>
                  <Ionicons
                    name={MEAL_ICONS[meal.name]}
                    size={18}
                    color="#333"
                    style={styles.mealIcon}
                  />
                  <Text style={styles.mealHeader}>{meal.name}</Text>
                </View>
                <Text style={styles.timer}>{timer}</Text>
              </View>
              <Text style={styles.timeRange}>
                {formatTime(meal.startHour, meal.startMinute)} – {formatTime(meal.endHour, meal.endMinute)}
              </Text>
              <Text style={styles.mealItems}>{meal.items.join(', ')}</Text>
              {meal.highlights?.map((item) => {
                const key = `${meal.name}-${item}`;
                return (
                  <View key={key} style={styles.highlightRow}>
                    <Text style={styles.highlightText}>{item}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(key)} style={styles.favoriteButton}>
                      <Ionicons
                        name={favorites[key] ? 'heart' : 'heart-outline'}
                        size={18}
                        color={favorites[key] ? '#e91e63' : '#666'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openModal(key)} style={styles.rateButton}>
                      <Text style={styles.rateText}>{ratings[key] ? `${ratings[key]}★` : 'Rate'}</Text>
                    </TouchableOpacity>
                    {modalItem === key && (
                      <RatingModal
                        visible={true}
                        onClose={closeModal}
                        onSubmit={(r) => submitRating(key, r)}
                        initialRating={ratings[key]}
                      />
                    )}
                  </View>
                );
              })}
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#faf8f2',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTextWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    width: (width - 16 * 3) / 2,
  },
  ongoing: {
    backgroundColor: '#e8f5e9',
  },
  next: {
    backgroundColor: '#fff8e1',
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    marginRight: 4,
  },
  mealHeader: {
    fontSize: 16,
    fontWeight: '600',
  },
  timer: {
    fontSize: 12,
    color: '#d9534f',
  },
  timeRange: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  mealItems: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  favoriteButton: {
    marginHorizontal: 6,
  },
  rateButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rateText: {
    color: '#fff',
    fontSize: 12,
  },
});
