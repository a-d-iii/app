import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
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

  const showSummary = () => {
    if (!meals) return;
    const summary = meals
      .map(meal => `${meal.name}: ${meal.items.join(', ')}`)
      .join('\n');
    Alert.alert("Today's Summary", summary);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Today's Menu</Text>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{dayLabel}</Text>
        </View>
        {meals.map((m, idx) => (
        <View
          key={m.name}
          style={[
            styles.mealBlock,
            { backgroundColor: mealColors[idx % mealColors.length] },
          ]}
        >
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>{m.name}</Text>
            <Pressable onPress={() => toggleLike(m.name)}>
              <Ionicons
                name={likes[m.name] ? 'heart' : 'heart-outline'}
                size={20}
                color={likes[m.name] ? 'red' : 'black'}
              />
            </Pressable>
          </View>
          <Text style={styles.timing}>{`${formatTime(m.startHour, m.startMinute)} - ${formatTime(m.endHour, m.endMinute)}`}</Text>
          <Text style={styles.countdown}>Ends in: {countdown(m)}</Text>
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
        ))}
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timing: {
    color: '#333',
    marginBottom: 4,
  },
  countdown: {
    color: '#d00',
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
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
});
