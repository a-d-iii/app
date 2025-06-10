// src/screens/FoodMenuScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RatingModal from '../components/RatingModal';

import { MEALS } from '../data/meals';

// Pad numbers to two digits without relying on ES2017 String.padStart
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatTime(h: number, m: number) {
  return `${pad(h)}:${pad(m)}`;
}

type Ratings = { [key: string]: number };

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

  useEffect(() => {
    AsyncStorage.getItem('mealRatings').then((raw) => {
      if (raw) setRatings(JSON.parse(raw));
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

        const diff = start.getTime() - now.getTime();
        const secs = Math.max(0, Math.floor(diff / 1000));
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const label = now >= start ? 'Started' : `${pad(hrs)}:${pad(mins)}:${pad(s)}`;

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

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
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
                <Text style={styles.mealHeader}>{meal.name}</Text>
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
                    <TouchableOpacity
                      onPress={() => openModal(key)}
                      style={styles.rateButton}
                    >
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerTextWrap: {
    flex: 1,
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
  },
  mealBlock: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
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
