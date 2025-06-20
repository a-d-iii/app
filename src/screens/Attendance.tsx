import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const COURSES = [
  { code: 'CSE1001', name: 'Data Structures', attendance: 92 },
  { code: 'MAT1002', name: 'Calculus', attendance: 85 },
  { code: 'PHY1003', name: 'Physics', attendance: 88 },
  { code: 'ENG1004', name: 'English', attendance: 90 },
  { code: 'CHE1005', name: 'Chemistry', attendance: 81 },
  { code: 'CSE1006', name: 'Algorithms', attendance: 94 },
  { code: 'HUM1007', name: 'Psychology', attendance: 87 },
  { code: 'BIO1008', name: 'Biology', attendance: 80 },
  { code: 'ECO1009', name: 'Economics', attendance: 89 },
  { code: 'ELE1010', name: 'Electronics', attendance: 93 },
];

export default function Attendance() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Attendance</Text>
      {COURSES.map((c) => (
        <View key={c.code} style={styles.row}>
          <Text style={styles.courseText}>
            {c.code} - {c.name}
          </Text>
          <Text style={styles.attendanceText}>{c.attendance}%</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  courseText: {
    fontSize: 16,
    color: '#333',
  },
  attendanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6C5CE7',
  },
});
