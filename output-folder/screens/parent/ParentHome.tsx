import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { supabase } from '../../lib/supabase'; 
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Header from '../../components/Header';

// Define your data types
type ClassData = {
  id: number;
  class_name: string;
  teacher_id: string;
  start_date: string;
  end_date: string;
  description: string;
};

type TeacherData = {
  id: string;
  name: string;
  subject: string;
  avatar_url: string;
};

type ChildData = {
  id: string;
  full_name: string;
  parent_id: string;
};

// Utility function to validate UUIDs
const isValidUUID = (uuid: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
};

export default function ParentHome() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<Map<string, TeacherData>>(new Map());
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchChildAndClasses();
  }, []);

  const fetchChildAndClasses = async () => {
    try {
      setLoading(true);

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error retrieving parent session:', sessionError);
        throw new Error('Error retrieving parent session');
      }

      const parentId = session?.user?.id;
      if (!parentId) {
        throw new Error('Parent is not logged in');
      }

      // Fetch child data associated with parent ID
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId)
        .single();

      if (childError) {
        console.error('Error fetching child data:', childError);
        throw new Error('Error fetching child data');
      }

      if (!childData) {
        throw new Error('No child linked to this parent');
      }

      // Ensure child ID is a valid UUID
      if (!isValidUUID(childData.id)) {
        console.error('Invalid UUID format for child ID:', childData.id);
        throw new Error('Invalid UUID format for child ID');
      }

      setChild(childData);

      // Fetch classes linked to the child's ID
      const { data: classStudentData, error: classStudentError } = await supabase
        .from('class_students')
        .select('class_id')
        .eq('student_id', childData.id); // Ensure this ID is in UUID format

      if (classStudentError) {
        console.error('Error fetching classes data:', classStudentError);
        throw new Error('Error fetching classes data');
      }

      const classIds = classStudentData.map((cs) => cs.class_id);

      // Fetch classes data based on the class IDs
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .in('id', classIds);

      if (classesError) {
        console.error('Error fetching class details:', classesError);
        throw new Error('Error fetching class details');
      }

      setClasses(classesData || []);

      // Fetch teacher data
      const teacherIds = [...new Set(classesData.map((c) => c.teacher_id))];

      if (teacherIds.length > 0) {
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles') 
          .select('*')
          .in('id', teacherIds);

        if (teacherError) {
          console.error('Error fetching teacher data:', teacherError);
          throw new Error('Error fetching teacher data');
        }

        const teacherMap = new Map();
        teacherData.forEach((teacher: TeacherData) => {
          teacherMap.set(teacher.id, teacher);
        });

        setTeachers(teacherMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);

      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderClassItem = ({ item }: { item: ClassData }) => (
    <View style={styles.classCard}>
      <Text style={styles.classTitle}>{item.class_name}</Text>
      <Text style={styles.classDescription}>{item.description}</Text>
      <Text style={styles.classDate}>
        {item.start_date} - {item.end_date}
      </Text>
      {teachers.get(item.teacher_id) && (
        <View style={styles.teacherInfo}>
          <Image source={{ uri: teachers.get(item.teacher_id)!.avatar_url }} style={styles.teacherAvatar} />
          <Text style={styles.teacherName}>{teachers.get(item.teacher_id)!.name}</Text>
          <Text style={styles.teacherSubject}>{teachers.get(item.teacher_id)!.subject}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container1}>      
      <Header title='Home' />
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {child?.full_name}</Text>
      <Text style={styles.subHeader}>Classes and Teachers</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.classesList}
        />
      )}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
 
  },
  container: {
    flex: 1,
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  classesList: {
    flexGrow: 0,
  },
  classCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  classDate: {
    fontSize: 14,
    color: '#555',
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  teacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  teacherSubject: {
    fontSize: 14,
    color: '#888',
  },
});
