import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { supabase } from '../../lib/supabase';
import TopBar from '../../components/TopBar';
import ClassHeader from '../../components/ClassHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';

type LessonsScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

type Props = {
  navigation: LessonsScreenNavigationProp;
  route: {
    params: {
      classId: string;
    };
  };
};

interface Course {
  id: number;
  title: string;
  imageurl: string; // تأكد من أن الاسم يطابق اسم العمود في قاعدة البيانات
}

type ClassData = {
  id: string;
  class_name: string;
  code: string;
};

const LessonsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const [courses, setCourses] = useState<Course[]>([]);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [studentCountState, setStudentCountState] = useState<number | null>(null);
  const [lessonCountState, setLessonCountState] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadClassData = async () => {
      try {
        // Fetch class data
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();

        if (classError) throw classError;

        setClassData(classData as ClassData);

        // Fetch student count
        const { count: studentCount, error: studentError } = await supabase
          .from('class_students')
          .select('id', { count: 'exact' })
          .eq('class_id', classId);

        if (studentError) throw studentError;

        setStudentCountState(studentCount || 0);

        // Fetch lesson count
        const { count: lessonCount, error: lessonError } = await supabase
          .from('class_lessons')
          .select('id', { count: 'exact' })
          .eq('class_id', classId);

        if (lessonError) throw lessonError;

        setLessonCountState(lessonCount || 0);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, [classId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, imageurl') // تأكد من استخدام أسماء الأعمدة الصحيحة
          .eq('class_id', classId);

        if (error) {
          console.error('Error fetching courses:', error);
        } else {
          setCourses(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [classId]);

  const handleAddCourse = () => {
    navigation.navigate('AddCourse', { classId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D31ED" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ClassHeader
        classData={classData}
        studentCount={studentCountState}
        lessonCount={lessonCountState}
        loading={loading}
      />

      <TopBar activeTab="Lessons" classId={classId} />

      <ScrollView style={styles.container}>
        {courses.map(course => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <Image source={{ uri: course.imageurl }} style={styles.courseImage} />
            <Text style={styles.courseTitle}>{course.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* زر Plus لإضافة course جديد */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  courseCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  courseImage: {
    width: '100%',
    height: 150,
  },
  courseTitle: {
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6D31ED',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default LessonsScreen;
