import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../data/meals';
import { useNavigation } from '@react-navigation/native';
import RatingModal from '../components/RatingModal';
// Load the bundled menu as an offline fallback so the screen always has data
// even when network requests fail.
import localMenu from '../../monthly-menu-may-2025.json';

const MENU_URL =
  'https://raw.githubusercontent.com/a-d-iii/app/main/monthly-menu-may-2025.json';

interface MonthlyMenu {
  [date: string]: Meal[];
}

export default function FoodMenuScreen() {
  // Start with the bundled menu so something is shown immediately
  const [menu, setMenu] = useState<MonthlyMenu>(localMenu as MonthlyMenu);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [ratingMeal, setRatingMeal] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigation = useNavigation();

  // Update current time every second so countdowns refresh
  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const dayLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const meals = menu?.[todayKey];
  const mealColors = ['#ffeef0', '#eef7ff', '#e8fff0', '#fff5e0'];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!meals) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No menu found for today.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MonthlyMenuScreen' as never)}
        >
          <Text style={styles.buttonText}>View Full Month</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleLike = (name: string) => {
    setLikes(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const formatTime = (hour: number, minute: number) =>
    `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;

  const countdown = (m: Meal) => {
    const end = new Date(today);
    end.setHours(m.endHour, m.endMinute, 0, 0);
    const diff = end.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Ended';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const mealIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'breakfast':
        return 'cafe';
      case 'lunch':
        return 'fast-food';
      case 'snacks':
        return 'pizza';
      case 'dinner':
        return 'restaurant';
      default:
        return 'fast-food';
    }
  };

  const showSummary = () => {
    navigation.navigate('FoodSummaryScreen' as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Today's Menu</Text>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{dayLabel}</Text>
        </View>
        {meals.map((m, idx) => {
          const isEnded = countdown(m) === 'Ended';
          return (
            <View
              key={m.name}
              style={[
                styles.mealBlock,
                { backgroundColor: mealColors[idx % mealColors.length] },
                isEnded && styles.mealBlockEnded,
              ]}
            >
              <View style={styles.mealHeader}>
                <View style={styles.mealTitleRow}>
                  <Ionicons
                    name={mealIcon(m.name)}
                    size={16}
                    color="#fff"
                    style={styles.mealIcon}
                  />
                  <Text style={styles.mealTitle}>{m.name}</Text>
                </View>
                <View style={styles.mealHeaderRight}>
                  {isEnded ? (
                    <View style={styles.statusRow}>
                      <Ionicons name="checkmark-circle" size={16} color="green" />
                      <Text style={styles.statusText}>Done</Text>
                    </View>
                  ) : (
                    <View style={styles.statusRow}>
                      <Ionicons name="time-outline" size={16} color="#d00" />
                      <Text style={styles.statusText}>{countdown(m)}</Text>
                    </View>
                  )}
                  <Pressable onPress={() => toggleLike(m.name)} style={styles.likeBtn}>
                    <Ionicons
                      name={likes[m.name] ? 'heart' : 'heart-outline'}
                      size={20}
                      color={likes[m.name] ? 'red' : 'black'}
                    />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.timing}>{`${formatTime(m.startHour, m.startMinute)} - ${formatTime(m.endHour, m.endMinute)}`}</Text>
              <Text style={styles.mealItems}>{m.items.join(', ')}</Text>
              <Pressable
                style={styles.rateButton}
                onPress={() => setRatingMeal(m.name)}
              >
                <Ionicons name="star" size={16} color="#fff" />
                <Text style={styles.rateButtonText}>
                  {ratings[m.name] ? `${ratings[m.name]}★` : 'Rate'}
                </Text>
              </Pressable>
            </View>
          );
        })}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MonthlyMenuScreen' as never)}
        >
          <Text style={styles.buttonText}>View Full Month</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={showSummary}>
          <Text style={styles.buttonText}>Food Summary</Text>
        </TouchableOpacity>
      </ScrollView>
      <RatingModal
        visible={!!ratingMeal}
        onClose={() => setRatingMeal(null)}
        onSubmit={(r) =>
          ratingMeal && setRatings((prev) => ({ ...prev, [ratingMeal]: r }))
        }
        initialRating={ratingMeal ? ratings[ratingMeal] || 0 : 0}
        prompt="Rate this Meal"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
  },
  dateChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  mealBlock: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealBlockEnded: {
    opacity: 0.6,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    marginRight: 6,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  mealHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 4,
    color: '#333',
    fontSize: 12,
  },
  likeBtn: {
    marginLeft: 8,
  },
  timing: {
    color: '#333',
    marginBottom: 4,
  },
  mealItems: {
    color: '#555',
  },
  rateButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  rateButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
