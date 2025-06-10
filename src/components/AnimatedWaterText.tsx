// src/components/AnimatedWaterText.tsx

import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Animated, Easing } from 'react-native';
import Svg, { Defs, Mask, Rect, Text as SvgText } from 'react-native-svg';
import { Accelerometer } from 'expo-sensors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Create an Animated version of <Rect>
const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Props = {
  text: string;
  fontSize: number;
  fillColor?: string;        // water color
  containerWidth?: number;   // SVG width
  containerHeight?: number;  // SVG height
};

export default function AnimatedWaterText({
  text,
  fontSize,
  fillColor = '#66ccff',
  containerWidth = SCREEN_WIDTH * 0.8,
  containerHeight = fontSize * 1.2,
}: Props) {
  // Only track accelData.y (we only need vertical tilt)
  const [accelY, setAccelY] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(50); // ≈20Hz
    const sub = Accelerometer.addListener(({ y }) => {
      setAccelY(y);
    });
    return () => sub.remove();
  }, []);

  // Shared value for the water's Y position
  const waterY = useRef(new Animated.Value(containerHeight * 0.4)).current;

  // Whenever accelY changes, nudge waterY by up to ±20px
  useEffect(() => {
    // clamp y to roughly [-1..1]
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));
    const nY = clamp(accelY, -1, 1);
    const offsetRange = 20; // px
    // Base at 0.4×height, plus/minus offsetRange
    const target = containerHeight * 0.4 + nY * offsetRange;

    Animated.timing(waterY, {
      toValue: target,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [accelY, containerHeight, waterY]);

  const animatedProps = {
    y: waterY,
  };

  return (
    <Svg
      width={containerWidth}
      height={containerHeight}
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      pointerEvents="none"     // ← This ensures touches pass through
    >
      <Defs>
        <Mask id="text-mask">
          {/* 
            This white text defines the “window” through which you see water.
            But we will draw the same text again on top (solid white) so you never lose the letters.
          */}
          <SvgText
            x={containerWidth / 2}
            y={containerHeight * 0.6}
            textAnchor="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="900"
          >
            {text}
          </SvgText>
        </Mask>
      </Defs>

      {/* 
        The “water” rectangle. Because of mask="url(#text-mask)", 
        only the portion beneath the white text shape is visible.
      */}
      <AnimatedRect
        animatedProps={animatedProps}
        x={0}
        width={containerWidth}
        height={containerHeight * 1.5}  // Taller than viewport so it always covers
        fill={fillColor}
        mask="url(#text-mask)"
      />

      {/* 
        Draw the same text again in solid white on top, so the letters themselves
        stay fully visible—only the blue “water” behind them moves.
      */}
      <SvgText
        x={containerWidth / 2}
        y={containerHeight * 0.6}
        textAnchor="middle"
        fill="white"
        fontSize={fontSize}
        fontWeight="900"
      >
        {text}
      </SvgText>
    </Svg>
  );
}
