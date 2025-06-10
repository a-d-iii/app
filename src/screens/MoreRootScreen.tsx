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

export default function MoreRootScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: typeof utilities[0] }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => {
        if (item.key === 'gallery') {
          navigation.navigate('Gallery' as never);
        }
        // else if other keys → navigate elsewhere
      }}
    >
      <Ionicons name={item.icon} size={24} color="#333" />
      <Text style={styles.label}>{item.label}</Text>
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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginLeft: 12,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 16,
  },
});
