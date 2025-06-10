// src/components/CardCarousel.tsx

import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
} from 'react-native';
import Card, { CARD_HEIGHT } from './Card';
import SummaryCard from './SummaryCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_SIZE = 16;
const NUM_SPACING = 32;

type ClassInfo = {
  id: string;
  title: string;
  time: string;
};

type Props = {
  cards: ClassInfo[];           // array with overview at index 0
  onSwipeDown: () => void;
  onSwipeUp: () => void;
  onIndexChange?: (index: number) => void;
  tasks: { title: string; dueTime?: string }[];
  mealPlan: { mealName: string; items: string[] }[];
  insights: string[];
  events: { title: string; time: string }[];
  locationName: string;
};

export default function CardCarousel({
  cards,
  onSwipeDown,
  onSwipeUp,
  onIndexChange,
  tasks,
  mealPlan,
  insights,
  events,
  locationName,
}: Props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (
        _e: GestureResponderEvent,
        g: PanResponderGestureState
      ) => Math.abs(g.dy) > 20 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_e, g) => {
        const { dy } = g;
        if (dy > 20) onSwipeDown();
        else if (dy < -20) onSwipeUp();
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  // Update active index as user scrolls
  const handleScroll = (e: any) => {
    const value = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(value / SCREEN_WIDTH);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  };

  const dotTranslate = scrollX.interpolate({
    inputRange: [0, SCREEN_WIDTH * (cards.length - 1)],
    outputRange: [0, NUM_SPACING * (cards.length - 1)],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container} {...pan.panHandlers}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true, // avoid mutating the event object on JS thread

            listener: handleScroll,

          }
        )}
      >
        {cards.map((c, i) => (
          <View key={c.id} style={styles.page}>
            {c.id === 'overview' ? (
              <SummaryCard
                daySchedule={cards.slice(1).map(({ title, time }) => ({ title, time }))}
                tasks={tasks}
                mealPlan={mealPlan}
                insights={insights}
                events={events}
                locationName={locationName}
              />
            ) : (
              <Card
                title={c.title}
                time={c.time}
                daySchedule={cards.slice(1).map(({ title, time }) => ({ title, time }))}
                index={i - 1}
                classId={c.id}
                locationName={locationName}
              />
            )}
          </View>
        ))}
      </Animated.ScrollView>

      {activeIndex > 0 && (
        <>
          <View style={[styles.numRowWrap, { top: NUMBER_TOP }]}>
            <View style={[styles.numRow, { width: NUM_SPACING * (cards.length - 1) }]}>
              {cards.slice(1).map((_, idx) => {
                const realIndex = idx + 1;
                const scaleNum = scrollX.interpolate({
                  inputRange: [
                    (realIndex - 1) * SCREEN_WIDTH,
                    realIndex * SCREEN_WIDTH,
                    (realIndex + 1) * SCREEN_WIDTH,
                  ],
                  outputRange: [1, 1.3, 1],
                  extrapolate: 'clamp',
                });
                const scaleCircle = scrollX.interpolate({
                  inputRange: [
                    (realIndex - 1) * SCREEN_WIDTH,
                    realIndex * SCREEN_WIDTH,
                    (realIndex + 1) * SCREEN_WIDTH,
                  ],
                  outputRange: [1, 1.5, 1],
                  extrapolate: 'clamp',
                });
                return (
                  <TouchableOpacity
                    key={realIndex}
                    activeOpacity={0.7}
                    onPress={() => {
                      scrollRef.current?.scrollTo({
                        x: realIndex * SCREEN_WIDTH,
                        animated: true,
                      });
                    }}
                    style={styles.numItem}
                  >
                    <Animated.View
                      style={[styles.circleBehind, { transform: [{ scale: scaleCircle }] }]}
                    />
                    <Animated.Text
                      style={[styles.numText, { transform: [{ scale: scaleNum }] }]}
                    >
                      {realIndex}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <Text style={styles.hintText}>Swipe left/right to see all classes</Text>
        </>
      )}
    </View>
  );
}

const NUMBER_TOP = (SCREEN_HEIGHT - CARD_HEIGHT) / 3 + CARD_HEIGHT + 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numRowWrap: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  numRow: {
    flexDirection: 'row',
    height: NUM_SIZE * 1.5,
  },
  numItem: {
    width: NUM_SPACING,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBehind: {
    position: 'absolute',
    width: NUM_SIZE,
    height: NUM_SIZE,
    borderRadius: NUM_SIZE / 2,
    backgroundColor: '#333',
  },
  numText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  hintText: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
});
