import React, { useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

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
const CARD_SIZE = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2;

function getBackgroundColors(percentage: number): string[] {
  if (percentage >= 90) return ['#005f2f', '#2e8b57'];
  if (percentage >= 80) return ['#2e7d32', '#66bb6a'];
  if (percentage >= 70) return ['#4caf50', '#81c784'];
  if (percentage >= 60) return ['#fdd835', '#fff59d'];
  if (percentage >= 50) return ['#fb8c00', '#ffcc80'];
  if (percentage >= 40) return ['#d84315', '#ffab91'];
  if (percentage >= 30) return ['#bf360c', '#ff8a65'];
  return ['#8d6e63', '#d7ccc8'];
}

function SubjectCard({ item, index }: { item: typeof subjects[0]; index: number }) {
  const fade = useRef(new Animated.Value(0)).current;
  const rain = useRef(new Animated.Value(0)).current;
  const sun = useRef(new Animated.Value(0)).current;

  const isHigh = item.attendance >= 75;
  const isLow = item.attendance < 50;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    if (isHigh) {
      Animated.loop(
        Animated.timing(rain, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    }

    if (isLow) {
      Animated.loop(
        Animated.timing(sun, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ).start();
    }
  }, [fade, index, isHigh, isLow, rain, sun]);

  const rainTranslate = rain.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_SIZE, CARD_SIZE],
  });

  const sunRotate = sun.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = getBackgroundColors(item.attendance);

  const renderWeather = () => {
    if (isHigh) {
      return (
        <>
          <Animated.Text
            style={[styles.rain, { transform: [{ translateY: rainTranslate }] }]}
          >
            {"💧\n".repeat(5)}
          </Animated.Text>
          <Text style={styles.trees}>🌳 🌳 🌳</Text>
        </>
      );
    }

    if (isLow) {
      return (
        <>
          <Animated.Text style={[styles.sun, { transform: [{ rotate: sunRotate }] }]}>☀️</Animated.Text>
          <Text style={styles.dry}>🌵</Text>
        </>
      );
    }

    return (
      <>
        <Animated.Text style={[styles.sun, { transform: [{ rotate: sunRotate }] }]}>☀️</Animated.Text>
        <Text style={styles.trees}>🌳 🌳</Text>
      </>
    );
  };

  return (
    <Animated.View style={[styles.card, { opacity: fade }]}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} pointerEvents="none">
        {renderWeather()}
      </View>
      <Text style={styles.subject}>{item.name}</Text>
      <Text style={styles.attendance}>{item.attendance}%</Text>
    </Animated.View>
  );
}

export default function Attendance() {
  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <SubjectCard item={item} index={index} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  list: {
    padding: CARD_MARGIN,
    justifyContent: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    margin: CARD_MARGIN / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  attendance: {
    marginTop: 10,
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 4,
  },
  rain: {
    position: 'absolute',
    top: 0,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  sun: {
    fontSize: 24,
    color: '#fff',
  },
  trees: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  dry: {
    fontSize: 20,
    color: '#fff',
  },
});
