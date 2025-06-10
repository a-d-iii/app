import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const { icon } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <Ionicons name={icon as any} size={96} color="#fff" />
      </View>
      <Text style={styles.name}>Adithyaa</Text>

      <View style={styles.infoRow}>
        <Ionicons name="mail-outline" size={20} color="#555" style={styles.infoIcon} />
        <Text style={styles.infoText}>adithyaa@example.com</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={20} color="#555" style={styles.infoIcon} />
        <Text style={styles.infoText}>+1 (123) 456-7890</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={20} color="#555" style={styles.infoIcon} />
        <Text style={styles.infoText}>Student ID: 21BCE1234</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="school-outline" size={20} color="#555" style={styles.infoIcon} />
        <Text style={styles.infoText}>Department: Computer Science</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
});
