// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../lib/routeType';
// import { supabase } from '../../lib/supabase';
// import { useFocusEffect } from '@react-navigation/native';
// import TopBar from '../../components/TopBar';

// type StudentsClassScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'StudentsClass'>;

// type Props = {
//   navigation: StudentsClassScreenNavigationProp;
//   route: {
//     params: {
//       classId: string;
//     };
//   };
// };

// interface Student {
//   id: string;
//   name: string;
//   progress: string;
// }

// const StudentsClassScreen = ({ route, navigation }: Props) => {

//   const { classId } = route.params;
//   const [searchText, setSearchText] = useState('');
//   const [students, setStudents] = useState<Student[]>([]);

//   const loadStudents = useCallback(async () => {
//     try {
//       const { data, error } = await supabase
//         .from('class_students')
//         .select('*')
//         .eq('class_id', classId);

//       if (error) {
//         throw error;
//       }

//       if (Array.isArray(data)) {
//         setStudents(data);
//       }
//     } catch (error) {
//       console.error('Failed to load students:', error);
//       Alert.alert('Error', 'Failed to load students');
//     }
//   }, [classId]);

//   useFocusEffect(
//     useCallback(() => {
//       loadStudents();
//     }, [loadStudents])
//   );

//   const handleDeleteStudent = async (studentId: string) => {
//     try {
//       const { error } = await supabase
//         .from('class_students')
//         .delete()
//         .eq('id', studentId);

//       if (error) {
//         throw error;
//       }

//       setStudents((prevStudents) =>
//         prevStudents.filter((student) => student.id !== studentId)
//       );
//       Alert.alert('Success', 'Student deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete student:', error);
//       Alert.alert('Error', 'Failed to delete student');
//     }
//   };

//   const filteredStudents = students.filter((student) =>
//     student.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   console.log('Rendering StudentsClassScreen'); // Add this to help with debugging

//   return (
//       <View style={styles.container}>
//         {/* <View style={styles.header}>
//           <Text style={styles.headerText}>Student Management</Text>
//           <View style={styles.classInfo}>
//             <Text>Students: {students.length}</Text>
//             <Text>Lessons: 6</Text> 
//             <Text>Your class code: 123746</Text>
//           </View>
//         </View> */}
//         <TopBar activeTab="Students" classId={classId} />

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button}
//           onPress={() => navigation.navigate('CodeCombatCourses')}>
//             <Text style={styles.buttonText}>Invite students</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button}>
//             <Text style={styles.buttonText}>Add a new student</Text>
//           </TouchableOpacity>
//         </View>

//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           placeholderTextColor="#ccc"
//           value={searchText}
//           onChangeText={setSearchText}
//         />

//         <View style={styles.filterContainer}>
//           <TouchableOpacity style={styles.filterButton}><Text >Progress</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}><Text>Activity</Text></TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}><Text>Age Group</Text></TouchableOpacity>
//         </View>

//         <ScrollView style={styles.studentsList}>
//           {filteredStudents.map((student) => (
//             <View key={student.id} style={styles.studentCard}>
//               <View>
//                 <Text style={styles.studentName}>{student.name}</Text>
//                 <Text style={styles.studentProgress}>Progress: {student.progress}</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => handleDeleteStudent(student.id)}
//               >
//                 <Text style={styles.deleteButtonText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//     );
//   };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#8A2BE2',
//   },
//   header: {
//     paddingBottom: 10,
//     borderBottomColor: '#fff',
//     borderBottomWidth: 1,
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   classInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   buttonContainer: {
//     marginVertical: 20,
//     marginHorizontal: 20,
//   },
//   button: {
//     backgroundColor: '#333',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   searchInput: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     margin: 10,
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginRight: 20,
//     marginLeft: 20,
//     color: '#FFF',
//   },
//   filterButton: {
//     backgroundColor: '#444',
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     color:'#fff'
//   },
//   studentsList: {
//     flex: 1,
//   },
//   studentCard: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   studentName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   studentProgress: {
//     fontSize: 14,
//     color: '#666',
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     borderRadius: 5,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   deleteButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
// });

// export default StudentsClassScreen;


import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import TopBar from '../../components/TopBar';
import ClassHeader from '../../components/ClassHeader';

// Define types
interface Profile {
  full_name: string;
}

interface StudentFromDatabase {
  id: string;
  student_id: string;
  profiles: Profile | null;
}

interface Student {
  id: string;
  full_name: string;
}

type StudentsClassScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'StudentsClass'>;

type Props = {
  navigation: StudentsClassScreenNavigationProp;
  route: {
    params: {
      classId: string;
    };
  };
};

type ClassData = {
  id: string;
  class_name: string;
  code: string;
};

const StudentsClassScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params;
  const [searchText, setSearchText] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [studentCountState, setStudentCountState] = useState<number | null>(null);
  const [lessonCountState, setLessonCountState] = useState<number | null>(null);

  // Fetch class data and other related information
  const loadClassData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch class data
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (classError) {
        throw classError;
      }

      setClassData(classData as ClassData);

      // Fetch student count
      const { count: studentCount, error: studentError } = await supabase
        .from('class_students')
        .select('id', { count: 'exact' })
        .eq('class_id', classId);

      if (studentError) {
        throw studentError;
      }

      setStudentCountState(studentCount || 0);

      // Fetch lesson count
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
      Alert.alert('Error', 'Failed to fetch class data');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_students')
        .select(`
          id,
          student_id,
          profiles (
            full_name
          )
        `)
        .eq('class_id', classId);

      if (error) {
        throw error;
      }

      if (Array.isArray(data)) {
        const formattedData: Student[] = data.map((item: StudentFromDatabase) => ({
          id: item.student_id,
          full_name: item.profiles ? item.profiles.full_name : '',
        }));

        setStudents(formattedData);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useFocusEffect(
    useCallback(() => {
      loadClassData(); // Load class data when screen comes into focus
      loadStudents();
    }, [loadClassData, loadStudents])
  );

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('class_students')
        .delete()
        .eq('student_id', studentId);

      if (error) {
        throw error;
      }

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );
      Alert.alert('Success', 'Student deleted successfully');
    } catch (error) {
      console.error('Failed to delete student:', error);
      Alert.alert('Error', 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ClassHeader
        classData={classData}
        studentCount={studentCountState}
        lessonCount={lessonCountState}
        loading={loading}
      />

      <TopBar activeTab="Students" classId={classId} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClassCode', { classId })}
        >
          <Text style={styles.buttonText}>Invite students</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddStudent', { classId })}
        >
          <Text style={styles.buttonText}>Add a new student</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}><Text>Progress</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Activity</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}><Text>Age Group</Text></TouchableOpacity>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View>
              <Text style={styles.studentName}>{item.full_name}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteStudent(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.noStudentsContainer}>
            <Text style={styles.noStudentsText}>No students available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  filterButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  studentsList: {
    flex: 1,
  },
  studentCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noStudentsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noStudentsText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default StudentsClassScreen;
