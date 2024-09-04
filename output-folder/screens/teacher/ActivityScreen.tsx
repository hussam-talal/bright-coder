import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setClassId, setTeacherId } from '../../store/appSlice';
import { AuthStackParamList } from '../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import ClassHeader from '../../components/ClassHeader';
import { supabase } from '../../lib/supabase';

type ActivityNavigationProp = StackNavigationProp<AuthStackParamList>;

type ClassData = {
  class_name: string;
  code: string;
};

const ActivityScreen: React.FC = () => {
  const navigation = useNavigation<ActivityNavigationProp>();
  const dispatch: AppDispatch = useDispatch();
  const classId = useSelector((state: RootState) => state.app.classId);
  const teacherId = useSelector((state: RootState) => state.app.teacherId);

  const [classData, setClassData] = useState<ClassData | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [lessonCount, setLessonCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setClassId(1)); 
    dispatch(setTeacherId('teacher-uuid')); 
  }, [dispatch]);

  const loadClassData = useCallback(async () => {
    if (classId === null) return;

    try {
      setLoading(true);
      // Fetch class data
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .maybeSingle(); // Changed to maybeSingle()

      if (classError) {
        throw classError;
      }

      if (classData) {
        setClassData(classData as ClassData);
      } else {
        console.warn('No class data found.');
      }

      // Fetch student count
      const { count: studentCount, error: studentError } = await supabase
        .from('class_students')
        .select('id', { count: 'exact' })
        .eq('class_id', classId);

      if (studentError) {
        throw studentError;
      }

      setStudentCount(studentCount || 0);

      // Fetch lesson count
      const { count: lessonCount, error: lessonError } = await supabase
        .from('class_lessons')
        .select('id', { count: 'exact' })
        .eq('class_id', classId);

      if (lessonError) {
        throw lessonError;
      }

      setLessonCount(lessonCount || 0);
    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadClassData(); // Load class data when component mounts
  }, [loadClassData]);

  const navigateToAssignments = () => {
    if (classId !== null && teacherId !== null) {
      navigation.navigate('Assignments', { classId, teacherId });
    } else {
      console.error('Class ID or Teacher ID is missing');
    }
  };

  const navigateToChallenges = () => {
    if (classId !== null && teacherId !== null) {
      navigation.navigate('ChallengesScreen', { classId, teacherId });
    } else {
      console.error('Class ID or Teacher ID is missing');
    }
  };

  return (
    <View style={styles.container1}>
      {/* Use ClassHeader to display class information */}
      <ClassHeader
        classData={classData}
        studentCount={studentCount}
        lessonCount={lessonCount}
        loading={loading}
      />

      <View style={styles.container}>
        {/* Button to navigate to Assignments screen */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#50BFE6' }]}
          onPress={navigateToAssignments}
        >
          <Text style={styles.buttonText}>Assignments</Text>
        </TouchableOpacity>

        {/* Button to navigate to Challenges screen */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#004D40' }]}
          onPress={navigateToChallenges}
        >
          <Text style={styles.buttonText}>Challenges</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ActivityScreen;
