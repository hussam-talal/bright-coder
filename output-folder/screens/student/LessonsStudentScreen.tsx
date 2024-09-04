import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { fetchCoursesByClassCode } from '../../lib/CRUD'; // Make sure to import correctly
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType';
import { supabase } from '../../lib/supabase';
import HeaderStudent from '../../components/HeaderStudent';
import Header from '../../components/Header';


type CoursesScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'LessonsStudentScreen'>;

interface Course {
  id: number;
  title: string;
  description: string;
  imageurl: string;
}

const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<CoursesScreenNavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [classCode, setClassCode] = useState<string>(''); 
  const handleJoinClass = async () => {
    if (!classCode) {
      Alert.alert('Validation Error', 'Please enter a class code.');
      return;
    }

    try {
      setLoading(true);

      // Fetch class data from the database to validate the class code
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('code', classCode.trim()) // Ensure the class code is trimmed for leading/trailing spaces
        .single();

      if (classError || !classData) {
        Alert.alert('Error', 'Invalid class code. Please try again.');
        setLoading(false);
        return;
      }

      // Fetch courses related to the valid class code
      const fetchedCourses = await fetchCoursesByClassCode(classCode.trim());
      setCourses(fetchedCourses);

      Alert.alert('Success', 'Courses loaded successfully.');
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Course }) => (
    <TouchableOpacity 
      style={styles.courseCard} 
      onPress={() => navigation.navigate('LessonsStudentScreen', { courseId: item.id })}
    >
      <Image source={{ uri: item.imageurl }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    
    <View style={styles.container1}>
      <Header title="courses"/>
      <View style={styles.container}>

      <Text style={styles.header}>Join Class</Text>
      <TextInput
        style={styles.classCodeInput}
        placeholder="Enter class code"
        value={classCode}
        onChangeText={setClassCode}
      />

      <TouchableOpacity style={styles.joinButton} onPress={handleJoinClass}>
        <Text style={styles.joinButtonText}>Join Class</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      ) : (
        <>
          <Text style={styles.header}>Courses</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={courses.filter(course => course.title.toLowerCase().includes(searchText.toLowerCase()))}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            refreshing={loading}
            onRefresh={handleJoinClass}
          />
        </>
      )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CE36D1',
    padding: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: '#CE36D1',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E91E63',
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  classCodeInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  joinButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CoursesScreen;
