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
  if (percentage >= 90) return ['#1b5e20', '#388e3c']; // deep forest
  if (percentage >= 80) return ['#81c784', '#aed581']; // meadow green
  if (percentage >= 70) return ['#aed581', '#dcedc8']; // rolling fields
  if (percentage >= 60) return ['#ffe082', '#ffecb3']; // dry plains
  if (percentage >= 50) return ['#ffcc80', '#ffe0b2']; // arid hills
  if (percentage >= 40) return ['#ffb74d', '#ffccbc']; // cracked soil
  if (percentage >= 30) return ['#ff8a65', '#ffab91']; // barren land
  return ['#ffab91', '#ffe0b2']; // desert
}

function SubjectCard({ item, index }: { item: typeof subjects[0]; index: number }) {
  const fade = useRef(new Animated.Value(0)).current;
  const rain = useRef(new Animated.Value(0)).current;
  const sun = useRef(new Animated.Value(0)).current;
 
  const high = item.attendance >= 90;
  const midHigh = item.attendance >= 80 && item.attendance < 90;
  const mid = item.attendance >= 60 && item.attendance < 80;
  const low = item.attendance < 60;
 

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

 
    if (high) {
      Animated.loop(
        Animated.timing(rain, {
          toValue: 1,
          duration: 2500,
 
          useNativeDriver: true,
        }),
      ).start();
    }

 
    if (low) {
 
      Animated.loop(
        Animated.timing(sun, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ).start();
    }
 
  }, [fade, index, high, low, rain, sun]);
 

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
 
    if (high) {
 
      return (
        <>
          <Animated.Text
            style={[styles.rain, { transform: [{ translateY: rainTranslate }] }]}
          >
            {"💧\n".repeat(5)}
          </Animated.Text>
 
          <Text style={styles.trees}>{'🌳 '.repeat(4)}</Text>
        </>
      );
    }

    if (midHigh) {
      return (
        <>
          <Text style={styles.trees}>{'🌳 '.repeat(3)}</Text>
        </>
      );
    }

    if (mid) {
      return (
        <>
          <Animated.Text style={[styles.sun, { transform: [{ rotate: sunRotate }] }]}>☀️</Animated.Text>
          {item.attendance >= 70 ? <Text style={styles.trees}>🌳</Text> : <Text style={styles.dry}>🌾</Text>}
        </>
      );
    }

    // low attendance
    return (
      <>
        <Animated.Text style={[styles.sun, { transform: [{ rotate: sunRotate }] }]}>☀️</Animated.Text>
        <Text style={styles.dry}>{item.attendance < 30 ? '🏜️' : '🌵'}</Text>
 
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
