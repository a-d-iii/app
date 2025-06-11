import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Meal } from '../data/meals';
import { useNavigation } from '@react-navigation/native';

const MENU_URL = 'https://raw.githubusercontent.com/a-d-iii/app/main/monthly-menu-may-2025.json';

interface MonthlyMenu {
  [date: string]: Meal[];
}

export default function FoodMenuScreen() {
  const [menu, setMenu] = useState<MonthlyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  const todayKey = new Date().toISOString().slice(0, 10);
  const meals = menu?.[todayKey];


  if (loading || !meals) {

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


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.dateHeader}>{todayKey}</Text>
      {meals.map(m => (
        <View key={m.name} style={styles.mealBlock}>
          <Text style={styles.mealTitle}>{m.name}</Text>
          <Text style={styles.mealItems}>{m.items.join(', ')}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MonthlyMenuScreen' as never)}
      >
        <Text style={styles.buttonText}>View Full Month</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  dateHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  mealBlock: {
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealItems: {
    color: '#555',
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
