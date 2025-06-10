// src/screens/FoodMenuScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MEALS } from '../data/meals';

function formatTime(h: number, m: number) {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export default function FoodMenuScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Full Day’s Menu</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {MEALS.map((meal) => (
          <React.Fragment key={meal.name}>
            <Text style={styles.mealHeader}>
              {meal.name} ({formatTime(meal.startHour, meal.startMinute)} –
              {formatTime(meal.endHour, meal.endMinute)}):
            </Text>
            <Text style={styles.mealItems}>{meal.items.join(', ')}</Text>
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
  content: {
    padding: 16,
  },
  mealHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  mealItems: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
