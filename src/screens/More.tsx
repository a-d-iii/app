// src/screens/More.tsx

import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function More() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>More</Text>
      {/* Add your “More” settings or utilities here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  heading: { fontSize: 24, fontWeight: '700', color: '#333' },
});
