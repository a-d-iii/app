// src/screens/Home.tsx

import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Pressable,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  StatusBar,
  Platform,
} from 'react-native';
import useWeather from '../hooks/useWeather';
import CardCarousel from '../components/CardCarousel';
import WhatsNextPanel, { WhatsNextPanelHandle } from '../components/WhatsNextPanel';
import BottomPanel, { BottomPanelHandle } from '../components/BottomPanel';
import { GRADIENTS } from '../components/Card';

const BASE_CARDS = [
  { id: '1', title: 'ECE1001 @ Lab 3',    time: '08:00 – 08:50' },
  { id: '2', title: 'MAT1002 @ Room 105', time: '09:00 – 09:50' },
  { id: '3', title: 'PHY1003 @ Hall A',   time: '10:00 – 10:50' },
  { id: '4', title: 'CHE1004 @ Lab 2',    time: '11:00 – 11:50' },
  { id: '5', title: 'CSE1005 @ Room 201', time: '12:00 – 12:50' },
];

const OVERVIEW_ITEM = { id: 'overview', title: '', time: '' };

type PanelState = 'none' | 'top' | 'bottom' | 'closing';

function lightenHex(hex: string, amount = 0.5) {
  const h = hex.replace('#', '');
  const num = parseInt(h, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.round(r + (255 - r) * amount);
  g = Math.round(g + (255 - g) * amount);
  b = Math.round(b + (255 - b) * amount);
  const newColor = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return `#${newColor}`;
}

export default function Home() {
  const [panel, setPanel] = useState<PanelState>('none');
  const topRef = useRef<WhatsNextPanelHandle>(null);
  const botRef = useRef<BottomPanelHandle>(null);

  const [userTemp, amaravatiTemp] = useWeather();

  const unlock = () => setPanel('none');
  const openTop  = () => { if (panel === 'none') setPanel('top'); };
  const openBot  = () => { if (panel === 'none') setPanel('bottom'); };
  const closeTop = () => {
    if (panel === 'top') {
      setPanel('closing');
      topRef.current?.close();
      setTimeout(unlock, 150);
    }
  };
  const closeBot = () => {
    if (panel === 'bottom') {
      setPanel('closing');
      botRef.current?.close();
      setTimeout(unlock, 175);
    }
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (
        _evt: GestureResponderEvent,
        g: PanResponderGestureState
      ) => Math.abs(g.dy) > 20 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_e, g) => {
        const { dy } = g;
        if (panel === 'top')       { if (dy < -20) closeTop(); }
        else if (panel === 'bottom'){ if (dy > 20)  closeBot(); }
        else if (panel === 'none') {
          if (dy > 20)  openTop();
          else if (dy < -20) openBot();
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const overlayVisible = panel !== 'none';

  const overlayPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (
        _evt: GestureResponderEvent,
        g: PanResponderGestureState
      ) => {
        return (
          panel === 'top' && g.dy < -20 && Math.abs(g.dy) > Math.abs(g.dx)
        );
      },
      onPanResponderRelease: () => { if (panel === 'top') closeTop(); },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#f0f0f0');

  useEffect(() => {
    if (activeIndex > 0) {
      const gradientIndex = activeIndex - 1;
      const primary = GRADIENTS[gradientIndex]?.[0] || '#000000';
      const lighter = lightenHex(primary, 0.6);
      setBgColor(lighter);
    }
  }, [activeIndex]);

  const allCards = [OVERVIEW_ITEM, ...BASE_CARDS];

  // Example summary data; replace with real data
  const summaryTasks = [
    { title: 'Finish assignment', dueTime: '2:00 PM' },
    { title: 'Call mentor', dueTime: '4:30 PM' },
  ];
  const summaryMealPlan = [
    { mealName: 'Breakfast', items: ['Oatmeal', 'Orange Juice'] },
    { mealName: 'Lunch', items: ['Grilled Chicken', 'Salad'] },
    { mealName: 'Dinner', items: ['Pasta', 'Steamed Veggies'] },
  ];
  const summaryInsights = [
    'You have a 1-hour break after 10 AM.',
    'Consider reviewing lecture notes tonight.',
  ];
  const summaryEvents = [
    { title: 'Team Meeting', time: '3:30 PM' },
    { title: 'Gym Session', time: '6:00 PM' },
  ];
  const locationName = 'Amaravati, IN';

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          // Use bgColor only on class cards; summary stays transparent
          backgroundColor: activeIndex > 0 ? bgColor : 'transparent',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      {/* Main Carousel Region */}
      <View style={styles.carouselRegion} {...pan.panHandlers}>
        <CardCarousel
          cards={allCards}
          onSwipeDown={openTop}
          onSwipeUp={openBot}
          onIndexChange={(newIdx) => setActiveIndex(newIdx)}
          tasks={summaryTasks}
          mealPlan={summaryMealPlan}
          insights={summaryInsights}
          events={summaryEvents}
          locationName={locationName}
        />
      </View>

      {overlayVisible && (
        <Pressable
          style={styles.overlay}
          {...overlayPan.panHandlers}
          onPress={() => {
            if (panel === 'top') closeTop();
            else if (panel === 'bottom') closeBot();
          }}
        />
      )}

      <WhatsNextPanel
        ref={topRef}
        isVisible={panel === 'top'}
        onDismiss={closeTop}
      />

      <BottomPanel
        ref={botRef}
        isVisible={panel === 'bottom'}
        onDismiss={closeBot}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  carouselRegion: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 5,
  },
});
