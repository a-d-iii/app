 
import React, { useEffect, useRef } from 'react';
 
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Pressable,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const subjects = [
  { name: 'Data Structures', code: 'CS201', attendance: 95 },
  { name: 'Operating Systems', code: 'CS202', attendance: 82 },
  { name: 'Algorithms', code: 'CS203', attendance: 70 },
  { name: 'Calculus', code: 'MA101', attendance: 60 },
  { name: 'Statistics', code: 'MA201', attendance: 50 },
  { name: 'Networking', code: 'CS204', attendance: 45 },
  { name: 'Cyber Security', code: 'CS301', attendance: 35 },
  { name: 'AI', code: 'CS302', attendance: 25 },
  { name: 'Database Systems', code: 'CS205', attendance: 88 },
  { name: 'Software Engineering', code: 'CS206', attendance: 77 },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 12;
 
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2 - 8;
const CARD_HEIGHT = 130;
 

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

function getIconColor(p: number): string {
  if (p >= 75) return '#2e7d32';
  if (p >= 70) return '#f9a825';
  return '#c62828';
}
 

function SubjectCard({ item, isLab }: { item: typeof subjects[0]; isLab: boolean }) {
  const bg = getBackgroundColor(item.attendance);
  const icon = getIcon(item.attendance);
  const iconColor = getIconColor(item.attendance);
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [scale]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bg },
        isLab && styles.labCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.subject}>{item.name}</Text>
        <Text style={styles.code}>{item.code}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.percentWrap}>
          <Text style={styles.attendance}>{item.attendance}</Text>
          <Text style={styles.percentSymbol}>%</Text>
        </View>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name={icon as any} size={24} color={iconColor} style={styles.icon} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

export default function Attendance() {
  const rotate = useRef(new Animated.Value(0)).current;
  const rScale = useRef(new Animated.Value(1)).current;

  const handleRefresh = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(rScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
        Animated.timing(rScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]),
      Animated.timing(rotate, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ]).start(() => rotate.setValue(0));
  };

  const rotateInterpolate = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Attendance</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <SubjectCard item={item} isLab={index >= subjects.length - 4} />
        )}
      />
      <Pressable onPress={handleRefresh} style={styles.refreshWrap}>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }, { scale: rScale }] }}>
          <Ionicons name="refresh" size={28} color="#212121" />
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    margin: 16,
    color: '#212121',
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
  labCard: {
    borderWidth: 2,
    borderColor: '#757575',
  },
  cardPressed: {
    opacity: 0.8,
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  code: {
    fontSize: 14,
    color: '#212121',
  },
  body: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  percentWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attendance: {
    fontSize: 42,
    fontWeight: '700',
    color: '#212121',
  },
  percentSymbol: {
    fontSize: 26,
    color: '#212121',
    marginBottom: 2,
    marginLeft: 2,
  },
  icon: {
    alignSelf: 'flex-end',
  },
  refreshWrap: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 24,
  },
});
