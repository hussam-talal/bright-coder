import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ProgressBarAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCourseProgress } from '../../../lib/CRUD'; 
import Header from '../../../components/Header';

interface CourseProgress {
  course_id: number;
  course_name: string;
  progress_percentage: number;
  // أضف الحقول الأخرى حسب الحاجة
}

const CompletedCoursesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const [courses, setCourses] = useState<CourseProgress[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const rawData = await fetchCourseProgress();
        const data: CourseProgress[] = rawData.map((course: any) => ({
          course_id: course.id, 
          course_name: course.name,
          progress_percentage: course.progress,
        }));
        setCourses(data);
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    loadCourses();
  }, []);

  const renderCourse = ({ item }: { item: CourseProgress }) => (
    <View style={styles.courseContainer}>
      <Text style={styles.courseTitle}>{item.course_name}</Text>
      <Text style={styles.courseCompletion}>Completion: {item.progress_percentage}%</Text>
      <ProgressBarAndroid 
        styleAttr="Horizontal" 
        color="#f08cfc" 
        indeterminate={false} 
        progress={item.progress_percentage / 100} 
      />
      <TouchableOpacity 
        style={styles.courseButton}
       // onPress={() => navigation.navigate('CourseDetails', { courseId: item.course_id })}
      >
        <Text style={styles.courseButtonText}>View Course</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container1}>      
      <Header title='Completed Courses' />
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={item => item.course_id.toString()}
        contentContainerStyle={styles.courseList}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
 
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  courseList: {
    paddingBottom: 20,
  },
  courseContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseCompletion: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  courseButton: {
    backgroundColor: '#d084fc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  courseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CompletedCoursesScreen;
