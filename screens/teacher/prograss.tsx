import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { supabase } from '../../lib/supabase';
import TopBar from '../../components/TopBar'; // تأكد من تحديث المسار حسب موقع الملف
import ClassHeader from '../../components/ClassHeader';

type PrograssClassScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PrograssClass'>;

// type Props = {
//   navigation: PrograssClassScreenNavigationProp;
//   classId: any;
// };
type Props = {
  route: {
    params: {
      classId: any;
      className: string;
      studentCount: number;
      lessonCount: number;
      classCode: string;
      progressPercentage: number;
    };
  };
  navigation: PrograssClassScreenNavigationProp;
};
type ClassData = {
  id: string;
  class_name: string;
  code: string;
};



const PrograssClassScreen: React.FC<Props> = ({ route }) => {
  const { classId, className, studentCount, lessonCount, classCode, progressPercentage } = route.params;
    
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [studentCountState, setStudentCountState] = useState<number | null>(null);
  const [lessonCountState, setLessonCountState] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadClassData = async () => {
      if (!classId) {
        console.error('classId is undefined');
        return;
      }

      try {
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();

        if (classError) {
          throw classError;
        }

        setClassData(classData as ClassData);

        const { count: studentCount, error: studentError } = await supabase
          .from('class_students')
          .select('id', { count: 'exact' })
          .eq('class_id', classId);

        if (studentError) {
          throw studentError;
        }

        setStudentCountState(studentCount || 0);

        const { count: lessonCount, error: lessonError } = await supabase
          .from('class_lessons')
          .select('id', { count: 'exact' })
          .eq('class_id', classId);

        if (lessonError) {
          throw lessonError;
        }

        setLessonCountState(lessonCount || 0);
        
      } catch (error) {
        console.error('Failed to fetch class data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D31ED" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ClassHeader classData={classData} studentCount={studentCountState} lessonCount={lessonCountState} loading={loading} />

      {/* <View style={styles.header}>
        {classData ? (
          <>
            <Text style={styles.headerText}>{classData.class_name}</Text>
            <View style={styles.classInfo}>
              <Text style={styles.infoText}>Students: {studentCount !== null ? studentCount : 'Loading...'}</Text>
              <Text style={styles.infoText}>Lessons: {lessonCount !== null ? lessonCount : 'Loading...'}</Text>
              <Text style={styles.infoText}>Your class code: {classData.code}</Text>
            </View>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View> */}
      <TopBar activeTab="Progress" classId={classId} />
      </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#8A2BE2',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  classInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrograssClassScreen;
