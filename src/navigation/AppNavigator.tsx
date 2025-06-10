// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Planner from '../screens/Planner';
import Social from '../screens/Social';
import More from '../screens/More';
import FoodMenuScreen from '../screens/FoodMenuScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Planner" component={Planner} />
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodMenu"
          component={FoodMenuScreen}
          options={{ title: 'Full Menu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
