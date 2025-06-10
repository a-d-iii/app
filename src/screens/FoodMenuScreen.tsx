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
        <Text style={styles.mealHeader}>Breakfast (08:00 – 10:00):</Text>
        <Text style={styles.mealItems}>
          Upma, Poha, Idli, Paratha, Aloo Bhaji, Chai
        </Text>

        <Text style={styles.mealHeader}>Lunch (12:30 – 14:00):</Text>
        <Text style={styles.mealItems}>
          Veg Biryani, Dal Makhani, Mixed Veg, Roti, Salad
        </Text>

        <Text style={styles.mealHeader}>Dinner (19:00 – 21:00):</Text>
        <Text style={styles.mealItems}>
          Paneer Butter Masala, Chapati, Dal Tadka, Rice, Raita
        </Text>
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
