// src/components/BottomPanel.tsx

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height } = Dimensions.get('window');
const PANEL_HEIGHT = height * 0.5;

/* ―― Demo data ―― */
const REMINDERS = [
  'Finish ECE1001 Lab report',
  'Review MAT1002 notes',
  'PHY1003 problem set',
  'CHE1004 lab prep',
  'CSE1005 assignment',
];
const UTILITIES = [
  { icon: 'calculator-outline', label: 'Calculator' },
  { icon: 'stats-chart-outline', label: 'Attendance Tracker' },
  { icon: 'trending-up-outline', label: 'Grade Predictor' },
  { icon: 'map-outline', label: 'Campus Map' },
  { icon: 'help-circle-outline', label: 'Help Desk' },
  { icon: 'book-outline', label: 'Library Search' },
  { icon: 'settings-outline', label: 'Settings' },
];
/* ――――――――――――――――――――――――――― */

export type BottomPanelHandle = {
  close: () => void;
};

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

const BottomPanel = forwardRef<BottomPanelHandle, Props>(
  ({ isVisible, onDismiss }, ref) => {
    const slide = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

    // Expose close()
    useImperativeHandle(ref, () => ({
      close: () => slideDown(),
    }));

    // When isVisible flips to true → slide up
    useEffect(() => {
      if (isVisible) {
        Animated.timing(
          slide,
          Object.assign({ toValue: 1, duration: 150 }, { useNativeDriver: true })
        ).start();

        Animated.timing(slide, {
          toValue: 1,
          duration: 150, // faster open
          useNativeDriver: true,
        }).start();

      }
    }, [isVisible, slide]);

    // Slide-down, then notify parent
    const slideDown = () => {

      Animated.timing(
        slide,
        Object.assign({ toValue: 0, duration: 150 }, { useNativeDriver: true })
      ).start(() => {

      Animated.timing(slide, {
        toValue: 0,
        duration: 150, // faster close
        useNativeDriver: true,
      }).start(() => {

        onDismiss();
      });
    };

    const translateY = slide.interpolate({
      inputRange: [0, 1],
      outputRange: [PANEL_HEIGHT, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY }] },
          !isVisible && { pointerEvents: 'none' },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handleBar} />
        </View>

        <ScrollView
          style={styles.scrollContent}
          bounces
          overScrollMode="always"
          scrollEventThrottle={16}
          onScrollEndDrag={({ nativeEvent }) => {
            const { y } = nativeEvent.contentOffset;
            const { y: vy = 0 } = nativeEvent.velocity ?? {};
            if (y <= 0 && vy > 0.5) {
              slideDown();
            }
          }}
        >
          <Text style={styles.sectionHeader}>Reminders / To-Do</Text>
          {REMINDERS.map((item, idx) => (
            <View key={idx} style={styles.todoItem}>
              <Text style={styles.todoText}>• {item}</Text>
            </View>
          ))}

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Utilities</Text>
          <View style={styles.utilityGrid}>
            {UTILITIES.map((util, idx) => (
              <View key={idx} style={styles.utilityItem}>
                <Ionicons
                  name={util.icon as any}
                  size={28}
                  color="#444"
                  style={styles.utilityIcon}
                />
                <Text style={styles.utilityLabel}>{util.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    );
  }
);

export default BottomPanel;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
    backgroundColor: '#f0f2f5',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    zIndex: 10,
  },
  handleContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleBar: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
    color: '#333',
  },
  todoItem: {
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  todoText: {
    fontSize: 14,
    color: '#555',
  },
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  utilityItem: {
    width: '30%',
    alignItems: 'center',
    marginVertical: 12,
  },
  utilityIcon: {
    marginBottom: 4,
  },
  utilityLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});
