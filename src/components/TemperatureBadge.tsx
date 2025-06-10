// src/components/TemperatureBadge.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  value: string;               // e.g. "27°C"
  humidity: string;            // e.g. "65%"
  wind: string;                // e.g. "12 km/h"
  position: 'left' | 'right';  // corner placement on the card
};

export default function TemperatureBadge({
  value,
  humidity,
  wind,
  position,
}: Props) {
  const cornerStyle: ViewStyle =
    position === 'left' ? styles.left : styles.right;

  // Extract numeric part of temperature
  const tempNum = parseInt(value.replace(/\D/g, ''), 10) || 0;
  // Choose icon name based on temp
  const tempIconName =
    tempNum < 20
      ? 'thermometer-outline'
      : tempNum < 30
      ? 'thermometer-half-outline'
      : 'thermometer';

  // Slight “bounce” animation for humidity icon (JS-driven)
  const humidityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopHandle = Animated.loop(
      Animated.sequence([
        Animated.timing(humidityAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(humidityAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loopHandle.start();

    return () => {
      loopHandle.stop();
      // Avoid calling stopAnimation on a frozen value
    };
  }, [humidityAnim]);

  const humidityScale = humidityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={[styles.container, cornerStyle]}>
      {/* Temperature row */}
      <View style={styles.row}>
        <Ionicons name={tempIconName} size={18} color="#fff" />
        <Text style={styles.tempText}>{value}</Text>
      </View>

      {/* Humidity row */}
      <View style={styles.row}>
        <Animated.View style={{ transform: [{ scale: humidityScale }] }}>
          <Ionicons name="water-outline" size={14} color="#fff" />
        </Animated.View>
        <Text style={styles.smallText}>{humidity}</Text>
      </View>

      {/* Wind row */}
      <View style={styles.row}>
        <Ionicons name="speedometer-outline" size={14} color="#fff" />
        <Text style={styles.smallText}>{wind}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    // backgroundColor removed for full transparency
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  left: {
    left: 20,   // slightly inset from corner
  },
  right: {
    right: 20,  // slightly inset from corner
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tempText: {
    fontSize: 16,        // made larger
    fontWeight: '700',
    color: '#fff',
    marginLeft: 6,
  },
  smallText: {
    fontSize: 12,        // slightly larger
    color: '#fff',
    marginLeft: 6,
  },
});
