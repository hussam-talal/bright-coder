import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchClasses } from '../../lib/CRUD'; // قم بتحديث هذا المسار حسب مكان حفظ ملف CRUD
import Header from '../../components/Header'; 
import { Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { useFocusEffect } from '@react-navigation/native';

type ClassesNavigationProp = StackNavigationProp<AuthStackParamList, 'Classes'>;

const { width } = Dimensions.get('window');

interface Class {
  id:any;
  class_name: string;
  student_count: number;
  lesson_count: number;
  completion_percentage: number;
  code: string; // أضف هذه السطر لإضافة خاصية `code`
}

export default function Classes({ navigation }: { navigation: ClassesNavigationProp }) {
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('Action');
  const [classes, setClasses] = useState<Class[]>([]);

  const loadClasses = useCallback(async () => {
    try {
      const fetchedClasses = await fetchClasses();
      if (Array.isArray(fetchedClasses)) {
        setClasses(fetchedClasses as Class[]);
      } else {
        console.error('Unexpected data structure:', fetchedClasses);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClasses();
    }, [loadClasses])
  );

  const filteredClasses = classes.filter(c =>
    c.class_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="All Classes" />
      
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateClass')}
      >
        <Text style={styles.createButtonText}>Create New Class</Text>
      </Pressable>

      {filteredClasses.length > 0 ? (
        <ScrollView style={styles.classesList}>
          {filteredClasses.map((c) => (
            <View key={c.id} style={styles.classCard}>
              <Text style={styles.classTitle}>{c.class_name}</Text>
              <View style={styles.classDetails}>
                <Text style={styles.classDetailText}>{c.student_count} students</Text>
                <Text style={styles.classDetailText}>{c.lesson_count} lessons</Text>
                <Text style={styles.classDetailText}>{c.completion_percentage}% completion</Text>
              </View>
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={() => navigation.navigate('PrograssClass', { 
                  classId: c.id,
                  className: c.class_name, 
                  studentCount: c.student_count, 
                  lessonCount: c.lesson_count, 
                  classCode: c.code,
                  progressPercentage: c.completion_percentage 
                })}
              >
                <Text style={styles.manageButtonText}>Manage Class</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noClassesContainer}>
          <Text style={styles.noClassesText}>No classes available</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#A557F5',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#A557F5',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sortText: {
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortOption: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  sortIcon: {
    fontSize: 16,
    color: '#333',
  },
  classesList: {
    paddingHorizontal: 20,
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 7,
    padding: 0,
    marginBottom: 15,
    borderColor:'#000',
    borderWidth:1,

  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding:15
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:15

  },
  classDetailText: {
    fontSize: 14,
    color: '#666',
  },
  manageButton: {
    marginTop: 30,
    backgroundColor: '#B9E5FF',
    borderRadius: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#6D31ED',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noClassesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noClassesText: {
    fontSize: 18,
    color: '#333',
  },
});

