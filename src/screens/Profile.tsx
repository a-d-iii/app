import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '../context/UserContext';

const ICON_CHOICES = [
  'person-circle',
  'happy',
  'cafe',
  'planet',
  'school',
];

export default function Profile() {
  const { icon, setIcon } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.preview}>
        <Ionicons name={icon as any} size={80} color="#333" />
      </View>
      <Text style={styles.subtitle}>Choose your icon</Text>
      <FlatList
        data={ICON_CHOICES}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.iconOption, item === icon && styles.selected]}
            onPress={() => setIcon(item)}
          >
            <Ionicons name={item as any} size={40} color="#333" />
          </TouchableOpacity>
        )}
      />
      <View style={styles.details}>
        <Text style={styles.detailText}>Name: Adithyaa</Text>
        <Text style={styles.detailText}>Email: adithyaa@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  iconOption: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selected: {
    backgroundColor: '#ddd',
  },
  details: {
    marginTop: 24,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
