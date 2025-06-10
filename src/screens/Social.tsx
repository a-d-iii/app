// src/screens/Social.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Social() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Social</Text>
      {/* Add your social feed UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: '#333' },
});
