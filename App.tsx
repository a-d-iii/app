// App.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// Your existing screens:
import Home from './src/screens/Home';
import FoodMenuScreen from './src/screens/FoodMenuScreen';
import MonthlyMenuScreen from './src/screens/MonthlyMenuScreen';
import FoodSummaryScreen from './src/screens/FoodSummaryScreen';
import PlannerScreen from './src/screens/Planner';

// Placeholder or existing component for the Social tab
import SocialScreen from './src/screens/Social';

// ——— New files you need to create under src/screens: ———
// src/screens/MoreRootScreen.tsx  (listing utilities, including “Gallery”)
// src/screens/GalleryScreen.tsx   (the gallery view)

// Import those here:
import MoreRootScreen from './src/screens/MoreRootScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import Profile from './src/screens/Profile';
import { UserProvider } from './src/context/UserContext';

type RootStackParamList = {
  MainTabs: undefined;
  FoodMenuScreen: undefined;
  MonthlyMenuScreen: undefined;
  FoodSummaryScreen: undefined;
  Profile: undefined;
};

type TabParamList = {
  Home: undefined;
  Planner: undefined;
  Social: undefined;
  Food: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const MoreStack = createNativeStackNavigator();

/** 
 * Wrap the “More” tab in its own stack navigator.
 * MoreRootScreen lists utilities (e.g., “Gallery” button).
 * GalleryScreen displays all class‐filtered photos.
 */
function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreRoot" component={MoreRootScreen} />
      <MoreStack.Screen name="Gallery" component={GalleryScreen} />
    </MoreStack.Navigator>
  );
}

/** 
 * Main Tabs: Home, Planner, Social, Food, More (wrapped in MoreStackNavigator)
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Planner') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Social') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'More') {
            iconName = focused
              ? 'ellipsis-horizontal'
              : 'ellipsis-horizontal-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Social" component={SocialScreen} />
      <Tab.Screen name="Food" component={FoodMenuScreen} />
      {/* Use the stack navigator for “More” */}
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabs} />
          <RootStack.Screen
            name="FoodMenuScreen"
            component={FoodMenuScreen}
          />
          <RootStack.Screen
            name="MonthlyMenuScreen"
            component={MonthlyMenuScreen}
          />
          <RootStack.Screen
            name="FoodSummaryScreen"
            component={FoodSummaryScreen}
          />
          <RootStack.Screen name="Profile" component={Profile} />
          </RootStack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#555',
  },
});
