// src/components/Card.tsx

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RatingModal from './RatingModal';
import TemperatureBadge from './TemperatureBadge';
import useWeather from '../hooks/useWeather';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH * 0.85;
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.60;

/** Number of raindrops */
const RAINDROP_COUNT = 12;

/** More “painterly” multi-stop gradients */
export const GRADIENTS = [
  ['#8E44AD', '#C0392B', '#F39C12'],  // rich purples, reds, ochre
  ['#2C3E50', '#34495E', '#16A085'],  // deep blues, teal
  ['#E74C3C', '#D35400', '#F1C40F'],  // crimson, burnt orange, gold
  ['#27AE60', '#2980B9', '#8E44AD'],  // emerald, sapphire, amethyst
  ['#E67E22', '#D35400', '#CD6155'],  // warm oranges and red
];

type ClassInfo = { title: string; time: string };

type Props = {
  title: string;                    // e.g. "ECE1001 @ Lab 3"
  time: string;                     // e.g. "08:00 – 08:50"
  daySchedule: ClassInfo[];         // all classes of the day
  index: number;                    // for picking a painterly gradient
  classId: string;                  // unique ID for this class (for photo/rating storage)
  locationName: string;             // e.g. "Amaravati"
};

export default function Card({
  title,
  time,
  daySchedule,
  index,
  classId,
  locationName,
}: Props) {
  // Compute full weekday and date string
  const today = new Date();
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateNum = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Flip animation
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const lastTap = useRef<number>(0);

  // Rating modal
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Fetch weather
  const [
    /* userTemp */,
    /* userHumidity */,
    /* userWind */,
    amaravatiTemp,
    amaravatiHumidity,
    amaravatiWind,
  ] = useWeather();

  // Interpolation for front/back rotation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Double-tap to flip
  const handleTap = () => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      toggleFlip();
    } else {
      lastTap.current = now;
    }
  };

  const toggleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 180,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start(() => setFlipped(!flipped));
  };

  // Choose painterly gradient
  const gradientColors = GRADIENTS[index % GRADIENTS.length];


  const handleCapture = async (uri: string) => {
    const timestamp = Date.now();
    const raw = await AsyncStorage.getItem('photosByClass');
    const parsed: { [key: string]: { uri: string; timestamp: number }[] } =
      raw ? JSON.parse(raw) : {};
    const arr = parsed[classId] || [];
    arr.push({ uri, timestamp });
    parsed[classId] = arr;
    await AsyncStorage.setItem('photosByClass', JSON.stringify(parsed));
  };

  const openSystemCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted' || mediaStatus !== 'granted') return;

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
      handleCapture(asset.uri);
    }
  };

  // Submit rating
  const submitRating = async (rating: number) => {
    setCurrentRating(rating);
    try {
      const raw = await AsyncStorage.getItem('ratingsByClass');
      const parsed: { [key: string]: number } = raw ? JSON.parse(raw) : {};
      parsed[classId] = rating;
      await AsyncStorage.setItem('ratingsByClass', JSON.stringify(parsed));
    } catch {
      // silent
    }
  };

  // Split title
  const [courseCode, roomDetail] = title.includes('@')
    ? title.split('@').map((s) => s.trim())
    : [title, ''];

  return (
    <View style={styles.container}>
      {/* FRONT FACE */}
      <Animated.View
        pointerEvents={flipped ? 'none' : 'auto'}
        style={[
          styles.cardFace,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: frontInterpolate },
            ],
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={handleTap}>
          <LinearGradient
            colors={gradientColors}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
          >
            <BlobPattern />
            <Raindrops />
            <View style={styles.darkenOverlay} />

            {/* WEEKDAY & DATE */}
            <View style={styles.weekdayContainer}>
              <Text style={styles.weekdayText}>{weekday}</Text>
              <Text style={styles.dateText}>{dateNum}</Text>
            </View>

            {/* WEATHER BADGE (top-right) */}
            <TemperatureBadge
              value={amaravatiTemp}
              humidity={amaravatiHumidity}
              wind={amaravatiWind}
              position="right"
            />

            {/* LOCATION below the badge */}
            <Text style={styles.locationBelow}>{locationName}</Text>

            {/* CLASS DETAILS */}
            <View style={styles.contentContainer}>
              <Text style={styles.courseText}>{courseCode}</Text>
              {roomDetail !== '' && (
                <Text style={styles.roomText}>{roomDetail}</Text>
              )}
              <Text style={styles.timeText}>{time}</Text>
            </View>

            {/* BUTTON BAR */}
            <View style={styles.buttonBar}>
              <TouchableOpacity
                style={styles.button}
                onPress={openSystemCamera}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <Text style={styles.buttonText}>Capture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowRatingModal(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="star" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {currentRating > 0 ? `${currentRating}★` : 'Rate'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* BACK FACE */}
      <Animated.View
        pointerEvents={!flipped ? 'none' : 'auto'}
        style={[
          styles.cardFace,
          {
            transform: [
              { perspective: 1000 },
              { rotateY: backInterpolate },
            ],
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={handleTap}>
          <LinearGradient
            colors={gradientColors}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
          >
            <BlobPattern />
            <View style={[styles.darkenOverlay, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />

            {/* BACK-SIDE SCHEDULE */}
            <View style={styles.contentContainer}>
              <View style={styles.backContent}>
                <Text style={styles.backHeader}>Today's Schedule</Text>
                {daySchedule.map((cls, idx) => (
                  <View key={idx} style={styles.backRow}>
                    <Text style={styles.backTime}>{cls.time}</Text>
                    <Text style={styles.backTitle}>{cls.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* RATING MODAL */}
      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={submitRating}
        initialRating={currentRating}
      />
    </View>
  );
}

/** Raindrops animation **/
function Raindrops() {
  const drops = useRef<{
    anim: Animated.Value;
    xPos: number;
    delay: number;
    speed: number;
  }[]>(
    Array.from({ length: RAINDROP_COUNT }).map(() => ({
      anim: new Animated.Value(-Math.random() * CARD_HEIGHT),
      xPos: Math.random() * (CARD_WIDTH - 2) + 1,
      delay: Math.random() * 2000,
      speed: 1800 + Math.random() * 800,
    }))
  ).current;

  useEffect(() => {
    drops.forEach(({ anim, delay, speed }) => {
      const loop = () => {
        anim.setValue(-20);
        Animated.timing(anim, {
          toValue: CARD_HEIGHT + 20,
          duration: speed,
          delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            const newSpeed = 1800 + Math.random() * 800;
            const newDelay = Math.random() * 1200;
            anim.setValue(-20);
            Animated.timing(anim, {
              toValue: CARD_HEIGHT + 20,
              duration: newSpeed,
              delay: newDelay,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start(({ finished: f2 }) => {
              if (f2) loop();
            });
          }
        });
      };
      loop();
    });
  }, [drops]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {drops.map(({ anim, xPos }, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.raindrop,
            {
              left: xPos,
              transform: [{ translateY: anim }],
            },
          ]}
        />
      ))}
    </View>
  );
}

/** BlobPattern: translucent shapes **/
function BlobPattern() {
  return (
    <Svg width={CARD_WIDTH} height={CARD_HEIGHT} style={StyleSheet.absoluteFill}>
      {/* Blob 1 */}
      <Path
        d={`
          M ${0.1 * CARD_WIDTH} ${0.15 * CARD_HEIGHT}
          C ${-0.15 * CARD_WIDTH} ${-0.1 * CARD_HEIGHT}
            ${0.6 * CARD_WIDTH} ${0.25 * CARD_HEIGHT}
            ${0.5 * CARD_WIDTH} ${0.5 * CARD_HEIGHT}
          C ${0.4 * CARD_WIDTH} ${0.8 * CARD_HEIGHT}
            ${-0.05 * CARD_WIDTH} ${0.85 * CARD_HEIGHT}
            ${0.1 * CARD_WIDTH} ${0.55 * CARD_HEIGHT}
          C ${0.25 * CARD_WIDTH} ${0.3 * CARD_HEIGHT}
            ${-0.05 * CARD_WIDTH} ${0.35 * CARD_HEIGHT}
            ${0.1 * CARD_WIDTH} ${0.15 * CARD_HEIGHT}
          Z
        `}
        fill="rgba(255, 255, 255, 0.12)"
      />
      {/* Blob 2 */}
      <Path
        d={`
          M ${0.5 * CARD_WIDTH} ${0.2 * CARD_HEIGHT}
          C ${0.8 * CARD_WIDTH} ${0.05 * CARD_HEIGHT}
            ${1.2 * CARD_WIDTH} ${0.4 * CARD_HEIGHT}
            ${0.9 * CARD_WIDTH} ${0.55 * CARD_HEIGHT}
          C ${0.7 * CARD_WIDTH} ${0.75 * CARD_HEIGHT}
            ${0.6 * CARD_WIDTH} ${0.45 * CARD_HEIGHT}
            ${0.5 * CARD_WIDTH} ${0.3 * CARD_HEIGHT}
          C ${0.4 * CARD_WIDTH} ${0.15 * CARD_HEIGHT}
            ${0.3 * CARD_WIDTH} ${0.25 * CARD_HEIGHT}
            ${0.5 * CARD_WIDTH} ${0.2 * CARD_HEIGHT}
          Z
        `}
        fill="rgba(255, 255, 255, 0.08)"
      />
      {/* Blob 3 */}
      <Path
        d={`
          M ${0.2 * CARD_WIDTH} ${0.6 * CARD_HEIGHT}
          C ${0 * CARD_WIDTH} ${0.8 * CARD_HEIGHT}
            ${0.4 * CARD_WIDTH} ${1.1 * CARD_HEIGHT}
            ${0.7 * CARD_WIDTH} ${0.9 * CARD_HEIGHT}
          C ${1.0 * CARD_WIDTH} ${0.75 * CARD_HEIGHT}
            ${0.6 * CARD_WIDTH} ${0.65 * CARD_HEIGHT}
            ${0.4 * CARD_WIDTH} ${0.7 * CARD_HEIGHT}
          C ${0.2 * CARD_WIDTH} ${0.75 * CARD_HEIGHT}
            ${0.15 * CARD_WIDTH} ${0.55 * CARD_HEIGHT}
            ${0.2 * CARD_WIDTH} ${0.6 * CARD_HEIGHT}
          Z
        `}
        fill="rgba(255, 255, 255, 0.05)"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: 'visible',
    marginVertical: 16,
  },
  cardFace: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
  darkenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  weekdayContainer: {
    position: 'absolute',
    top: 12,
    left: 24,
    zIndex: 5,
  },
  weekdayText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 2,
  },
  dateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 24,
    fontWeight: '700',
  },
  topRightContainer: {
    position: 'absolute',
    top: 12,
    right: 24,
    alignItems: 'center',
    zIndex: 5,
  },
  locationBelow: {
    position: 'absolute',
    top: 88,           // pushes “Amaravati” down below the badge
    right: 24,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    zIndex: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 3,
  },
  courseText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 20,
  },
  roomText: {
    fontSize: 28,
    color: '#f0f0f0',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 20,
  },
  timeText: {
    fontSize: 24,
    color: '#f0f0f0',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  raindrop: {
    position: 'absolute',
    width: 1,
    height: 12,
    borderRadius: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  backContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 3,
  },
  backHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)',
    paddingBottom: 4,
    textAlign: 'center',
  },
  backRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  backTime: {
    fontSize: 16,
    color: '#e0f0ff',
    width: 100,
    fontWeight: '600',
  },
  backTitle: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
  buttonBar: {
    position: 'absolute',
    bottom: 12,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 4,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});
