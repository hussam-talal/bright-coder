import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../lib/supabase'; // Ensure this path is correct for your project structure
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';

type AddStudentScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AddStudent'>;

type Props = {
  navigation: AddStudentScreenNavigationProp;
  route: {
    params: {
      classId: string;
    };
  };
};

const AddStudent: React.FC<Props> = ({ navigation, route }) => {
  const { classId } = route.params;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      // Check if the class_id exists in the classes table
      const { data: classData, error: classSelectError } = await supabase
        .from('classes')
        .select('id')
        .eq('id', classId);

      if (classSelectError || classData.length === 0) {
        throw new Error('The specified class does not exist.');
      }

      // Check if there is already a profile with the same email
      const { data: existingProfiles, error: profileSelectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.trim());

      if (profileSelectError) {
        throw profileSelectError;
      }

      if (existingProfiles && existingProfiles.length > 0) {
        Alert.alert('Error', 'A student with this email already exists.');
        setLoading(false);
        return;
      }

      // Check if there is already a user with the same email
      const { data: existingUsers, error: userSelectError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.trim());

      if (userSelectError) {
        throw userSelectError;
      }

      let studentId;

      if (existingUsers && existingUsers.length > 0) {
        // If user already exists, use the existing user ID
        studentId = existingUsers[0].id;
      } else {
        // Generate a new student ID and insert into the users table
        studentId = uuidv4();

        const { error: userInsertError } = await supabase.from('users').insert([
          {
            id: studentId,
            email: email.trim(),
            // Add other necessary fields for the user
          },
        ]);

        if (userInsertError) {
          throw userInsertError;
        }
      }

      // Insert the new student into the profiles table
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: studentId, // Must match the `id` in the `users` table
            full_name: fullName.trim(),
            email: email.trim(),
            role: 'Student',
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      // Get current date for enrollment
      const enrollmentDate = new Date().toISOString();

      // Link the student to the class in the class_students table with an enrollment date
      const { error: classError } = await supabase.from('class_students').insert([
        {
          class_id: classId,
          student_id: studentId,
          enrollment_date: enrollmentDate, // Ensure this field is populated
        },
      ]);

      if (classError) {
        throw classError;
      }

      Alert.alert('Success', 'Student added successfully.');
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to add student:', error.message);
      Alert.alert('Error', `Failed to add student. Please try again. \n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Student</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter student's name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter student's email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddStudent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Student</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStudent;
