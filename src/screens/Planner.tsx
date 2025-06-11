import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { WEEKLY_SCHEDULE, ClassEntry } from '../data/weeklySchedule';

const DAYS = Object.keys(WEEKLY_SCHEDULE);

export default function Planner() {
  const [day, setDay] = useState<string>(DAYS[0]);
  const classes: ClassEntry[] = WEEKLY_SCHEDULE[day];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <Text style={styles.heading}>Weekly Timetable</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dayRow}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {DAYS.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDay(d)}
            style={[styles.dayButton, day === d && styles.dayButtonActive]}
          >
            <Text
              style={[styles.dayText, day === d && styles.dayTextActive]}
            >
              {d.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scheduleContainer}>
        {classes.map((cls, idx) => (
          <View key={idx} style={styles.classBox}>
            <View style={styles.classLeft}>
              <Text style={styles.courseText}>{cls.course}</Text>
              <Text style={styles.facultyText}>{cls.faculty}</Text>
            </View>
            <View style={styles.classRight}>
              <Text style={styles.timeText}>
                {cls.start} – {cls.end}
              </Text>
              <Text style={styles.roomText}>{cls.room}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 16,
    marginHorizontal: 16,
    color: '#333',
  },
  dayRow: {
    flexGrow: 0,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e0e0e0',
  },
  dayButtonActive: {
    backgroundColor: '#6C5CE7',
  },
  dayText: { fontSize: 14, color: '#333' },
  dayTextActive: { color: '#fff', fontWeight: '700' },
  scheduleContainer: { padding: 16 },
  classBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 2,
  },
  classLeft: { flex: 1 },
  courseText: { fontSize: 14, fontWeight: '600', color: '#333' },
  facultyText: { fontSize: 12, color: '#666', marginTop: 2 },
  classRight: { justifyContent: 'space-between', alignItems: 'flex-end' },
  timeText: { fontSize: 12, color: '#333' },
  roomText: { fontSize: 10, color: '#666', marginTop: 2 },
});
