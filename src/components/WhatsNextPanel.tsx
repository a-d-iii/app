// src/components/WhatsNextPanel.tsx

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MEALS } from '../data/meals';
import type { Meal } from '../data/meals';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.35; // covers 35% of screen


function formatHour(h: number, m: number): string {
  let suffix = 'AM';
  let hour12 = h;
  if (h === 0) hour12 = 12;
  else if (h === 12) suffix = 'PM';
  else if (h > 12) {
    hour12 = h - 12;
    suffix = 'PM';
  }
  const minutePadded = m < 10 ? `0${m}` : `${m}`;
  if (minutePadded === '00') return `${hour12} ${suffix}`;
  return `${hour12}:${minutePadded} ${suffix}`;
}

export type WhatsNextPanelHandle = {
  close: () => void;
};

type Props = {
  isVisible: boolean;
  onDismiss: () => void;
};

const WhatsNextPanel = forwardRef<WhatsNextPanelHandle, Props>(
  ({ isVisible, onDismiss }: Props, ref: React.ForwardedRef<WhatsNextPanelHandle>) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Animated value: 0 = hidden above, 1 = fully visible
    const slide = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

    // When isVisible → animate slide down
    useEffect(() => {
      if (isVisible) {
        Animated.timing(slide, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    }, [isVisible, slide]);

    // Expose close() to parent via ref
    useImperativeHandle(ref, () => ({
      close: () => {
        Animated.timing(slide, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          onDismiss();
        });
      },
    }));

    // State for next meal, countdown, etc.
    const [nextMealName, setNextMealName] = React.useState('');
    const [nextRange, setNextRange] = React.useState('');
    const [menuItems, setMenuItems] = React.useState<string[]>([]);
    const [countdown, setCountdown] = React.useState('00:00:00');

    // Compute next meal
    function computeNextMeal(): Date {
      const now = new Date();
      let found: Meal | undefined = MEALS.find((meal: Meal) => {
        if (now.getHours() < meal.startHour) return true;
        if (
          now.getHours() === meal.startHour &&
          now.getMinutes() < meal.startMinute
        )
          return true;
        return false;
      });

      const target = new Date(now);
      if (!found) {
        found = MEALS[0];
        target.setDate(now.getDate() + 1);
        target.setHours(found.startHour, found.startMinute, 0, 0);
      } else {
        target.setHours(found.startHour, found.startMinute, 0, 0);
      }

      const startStr = formatHour(found.startHour, found.startMinute);
      const endStr = formatHour(found.endHour, found.endMinute);
      setNextMealName(found.name);
      setNextRange(`${startStr} – ${endStr}`);
      setMenuItems(found.items);
      return target;
    }

    // Countdown ticker
    useEffect(() => {
      let target = computeNextMeal();
      const update = () => {
        const now = new Date();
        let diff = Math.max(0, target.getTime() - now.getTime());
        if (diff <= 0) {
          target = computeNextMeal();
          diff = target.getTime() - new Date().getTime();
        }
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff - hrs * 1000 * 60 * 60) / (1000 * 60));
        const secs = Math.floor(
          (diff - hrs * 1000 * 60 * 60 - mins * 1000 * 60) / 1000
        );
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        setCountdown(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);
      };
      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }, []);

    // PanResponder to catch swipe-up on the panel itself
    const innerPan = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => isVisible,
        onMoveShouldSetPanResponder: (_evt, gs: any) => {
          const { dy, dx } = gs;
          return isVisible && dy < -20 && Math.abs(dy) > Math.abs(dx);
        },
        onPanResponderRelease: () => {
          // Trigger close()
          if (ref && typeof ref !== 'function') {
            (ref as React.RefObject<WhatsNextPanelHandle>).current?.close();
          }
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => false,
      })
    ).current;

    // If not visible, disable touches
    return (
      <Animated.View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            height: PANEL_HEIGHT + insets.top,
            transform: [
              {
                translateY: slide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-PANEL_HEIGHT - insets.top, 0],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
          !isVisible && { pointerEvents: 'none' },
        ]}
      >
        {/* Handle bar and swipe-up listener */}
        <View style={styles.handleContainer} {...innerPan.panHandlers}>
          <View style={styles.handle} />
        </View>

        <View style={styles.content}>
          <Text style={styles.header}>What’s Next</Text>

          <View style={styles.section}>
            <Text style={styles.mealName}>{nextMealName}</Text>
            <Text style={styles.mealTime}>{nextRange}</Text>
            <Text style={styles.countdown}>Starts in {countdown}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Menu</Text>
            <Text style={styles.menuText}>{menuItems.join(', ')}</Text>
          </View>
        </View>

        <Pressable
          style={styles.fullMenuButton}
          onPress={() => {

            navigation.getParent()?.navigate('FoodMenuScreen');

            Animated.timing(slide, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }).start(() => onDismiss());
          }}
        >
          <Text style={styles.fullMenuText}>View Full Menu</Text>
        </Pressable>
      </Animated.View>
    );
  }
);

export default WhatsNextPanel;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, // animate from -PANEL_HEIGHT to 0
    left: 0,
    right: 0,
    height: PANEL_HEIGHT,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  handleContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  mealTime: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  countdown: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d9534f',
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  fullMenuButton: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  fullMenuText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
