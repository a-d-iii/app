// src/screens/MoreRootScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * A simple list of utilities under “More”.
 * For now we only implement “Gallery,” but you could add others later.
 */
const utilities = [
  { key: 'gallery', label: 'Gallery', icon: 'images-outline' },
  // add more utilities here if needed…
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
    <View style={styles.container}>
      <FlatList
        data={utilities}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
