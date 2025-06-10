// src/screens/Planner.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Planner() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Planner</Text>
      {/* Add your planner UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: '#333' },
});
