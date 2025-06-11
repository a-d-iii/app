// src/screens/MoreRootScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * A simple list of utilities under “More”.
 * For now we only implement “Gallery,” but you could add others later.
 */
const utilities = [
  { key: 'gallery', label: 'Gallery', icon: 'images-outline' },
  { key: 'cgpa', label: 'CGPA Calculator', icon: 'calculator-outline' },
  { key: 'facultyRanker', label: 'Faculty Ranker', icon: 'bar-chart-outline' },
  { key: 'jpgToPdf', label: 'JPG to PDF', icon: 'document-outline' },
  { key: 'cetc', label: 'CETC', icon: 'school-outline' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 3; // display three utilities per row

export default function MoreRootScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: typeof utilities[0] }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => {
        if (item.key === 'gallery') {
          navigation.navigate('Gallery' as never);
        }
        // else if other keys → navigate elsewhere
      }}
    >
      <Ionicons name={item.icon} size={32} color="#333" />
      <Text style={styles.tileLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <FlatList
        data={utilities}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        numColumns={NUM_COLUMNS}
        // Ensure a fresh render if NUM_COLUMNS changes
        key={`grid-${NUM_COLUMNS}`}

        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  grid: {
    paddingVertical: 16,
  },
  tile: {
    width: SCREEN_WIDTH / NUM_COLUMNS,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  tileLabel: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
