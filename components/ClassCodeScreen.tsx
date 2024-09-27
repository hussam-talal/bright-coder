import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../lib/supabase'; // Make sure supabase is correctly imported
import { AuthStackParamList } from '../lib/routeType';
import { addClassStudent } from '../lib/CRUD'; // Import the function to add a student to the class
import { getAuth } from 'firebase/auth';

type ClassCodeScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export default function ClassCodeScreen() {
  const navigation = useNavigation<ClassCodeScreenNavigationProp>();
  const [classCode, setClassCode] = useState('');

  const handleJoinClass = async () => {
    if (!classCode) {
      Alert.alert('Validation Error', 'Please enter a class code.');
      return;
    }

    try {
      console.log('Checking class code:', classCode); // Log the class code for debugging

      // Check the validity of the class code in the database
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('code', classCode)
        .single();

      if (classError) {
        console.error('Supabase error fetching class:', classError);
        Alert.alert('Error', 'Failed to fetch class. Please try again.');
        return;
      }

      if (!classData) {
        console.warn('No class found with the provided code.');
        Alert.alert('Error', 'Invalid class code. Please try again.');
        return;
      }

      // Get the current user's ID from Supabase auth
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('Firebase Auth error: No user is logged in.');
        Alert.alert('Error', 'User not found. Please log in.');
        return;
      }

      const userId = user.uid;

      // Add the student to the class
      await addClassStudent(classData.id, user.uid, new Date().toISOString());

      Alert.alert('Success', 'You have successfully joined the class.');
      navigation.navigate('StudentHome');
    } catch (error) {
      console.error('Error joining class:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Are you using Bright coder at school?</Text>

        <View style={styles.toggleContainer}>
          <Pressable style={[styles.toggleButton, styles.activeButton]}>
            <Text style={styles.toggleTextActive}>yes, school</Text>
          </Pressable>
          <Pressable style={styles.toggleButton}>
            <Text style={styles.toggleText} onPress={() => navigation.navigate('AgeSelection')}>no, free time</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Enter class code</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter class code"
          placeholderTextColor="#888"
          value={classCode}
          onChangeText={setClassCode}
        />

        <Pressable style={styles.joinButton} onPress={handleJoinClass}>
          <Text style={styles.joinButtonText}>JOIN CLASS</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#888',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#6200ea',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    color: '#000',
  },
  joinButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
