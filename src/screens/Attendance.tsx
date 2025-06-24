import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const subjects = [
  { name: 'Data Structures', attendance: 95 },
  { name: 'Operating Systems', attendance: 82 },
  { name: 'Algorithms', attendance: 70 },
  { name: 'Calculus', attendance: 60 },
  { name: 'Statistics', attendance: 50 },
  { name: 'Networking', attendance: 45 },
  { name: 'Cyber Security', attendance: 35 },
  { name: 'AI', attendance: 25 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2;
const CARD_HEIGHT = 150;

function getBackgroundColor(p: number): string {
  if (p >= 75) return '#c8e6c9';
  if (p >= 70) return '#fff9c4';
  return '#ffcdd2';
}

function getIcon(p: number): string {
  if (p >= 75) return 'checkmark-circle';
  if (p >= 70) return 'alert-circle';
  return 'close-circle';
}

function SubjectCard({ item }: { item: typeof subjects[0] }) {
  const bg = getBackgroundColor(item.attendance);
  const icon = getIcon(item.attendance);
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={styles.subject}>{item.name}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.percentWrap}>
          <Text style={styles.attendance}>{item.attendance}</Text>
          <Text style={styles.percentSymbol}>%</Text>
        </View>
        <Ionicons name={icon as any} size={20} color="#333" style={styles.icon} />
      </View>
    </View>
  );
}

export default function Attendance() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <SubjectCard item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    margin: 16,
    color: '#333',
    textAlign: 'left',
  },
  list: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 8,
    margin: CARD_MARGIN / 2,
    overflow: 'hidden',
  },
  header: {
    flex: 0.2,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  body: {
    flex: 0.8,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  percentWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attendance: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
  },
  percentSymbol: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
    marginLeft: 2,
  },
  icon: {
    alignSelf: 'flex-end',
  },
});
