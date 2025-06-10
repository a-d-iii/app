// src/screens/GalleryScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = SCREEN_WIDTH / 3 - 12;

/**
 * We'll assume photos are stored in AsyncStorage under a key "photosByClass",
 * with a value shaped like:
 * {
 *   [classId: string]: { uri: string; timestamp: number }[]
 * }
 */
type PhotoEntry = { uri: string; timestamp: number };
type StoredPhotos = { [classId: string]: PhotoEntry[] };

export default function GalleryScreen() {
  const [photosByClass, setPhotosByClass] = useState<StoredPhotos>({});
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [flatData, setFlatData] = useState<PhotoEntry[]>([]);

  // Load all photos from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('photosByClass')
      .then((raw) => {
        if (raw) {
          const parsed: StoredPhotos = JSON.parse(raw);
          setPhotosByClass(parsed);
        }
      })
      .catch(console.error);
  }, []);

  // Whenever photosByClass or selectedClass changes, update flatData
  useEffect(() => {
    if (selectedClass === 'all') {
      // flatten all entries
      const all: PhotoEntry[] = [];
      Object.values(photosByClass).forEach((arr) => {
        all.push(...arr);
      });
      // sort by timestamp descending
      all.sort((a, b) => b.timestamp - a.timestamp);
      setFlatData(all);
    } else {
      const arr = photosByClass[selectedClass] || [];
      arr.sort((a, b) => b.timestamp - a.timestamp);
      setFlatData(arr);
    }
  }, [photosByClass, selectedClass]);

  // Build list of class IDs for the picker
  const classIds = Object.keys(photosByClass);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gallery</Text>

      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedClass}
          onValueChange={(val) => setSelectedClass(val)}
        >
          <Picker.Item label="All Classes" value="all" />
          {classIds.map((cid) => (
            <Picker.Item key={cid} label={`Class ${cid}`} value={cid} />
          ))}
        </Picker>
      </View>

      {flatData.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No photos to display.</Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item, idx) => item.uri + idx}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.photo} />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    margin: 16,
    color: '#333',
  },
  pickerWrap: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 6,
    borderRadius: 8,
  },
});
