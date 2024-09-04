import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../lib/supabase'; // تأكد من استيراد supabase
import { updateProfile } from '../lib/CRUD'; // استيراد وظيفة تحديث البيانات

type AuthStackParamList = {
  ClassCodeScreen: undefined;
};

type AgeSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ClassCodeScreen'>;

export default function AgeSelectionScreen() {
  const navigation = useNavigation<AgeSelectionScreenNavigationProp>();
  const [ageRange, setAgeRange] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const handleStart = async () => {
    // تحقق من ملء الحقول المطلوبة
    if (!ageRange || !parentEmail) {
      Alert.alert('Validation Error', 'Please select an age range and enter a parent email.');
      return;
    }

    try {
      // تحقق مما إذا كان البريد الإلكتروني للوالد مسجلًا وله دور Parent
      const { data: parentData, error: parentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', parentEmail)
        .eq('role', 'Parent')
        .single();

      if (parentError || !parentData) {
        Alert.alert('Error', 'Parent email not found or not associated with a Parent role.');
        return;
      }

     // احصل على معرف المستخدم الحالي من Supabase auth
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        Alert.alert('Error', 'User not found');
        return;
      }


      // تحديث ملف المستخدم في جدول profiles
      await updateProfile(user.id, {
        age_range: ageRange,
        parent_email: parentEmail,
      });
      Alert.alert('Success', 'Profile updated successfully');

      // التنقل إلى الشاشة التالية
      navigation.navigate('ClassCodeScreen');
    } catch (error) {
      console.error('Error updating profile:', error);
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
          <Pressable style={styles.toggleButton}
          onPress={() => navigation.navigate('ClassCodeScreen')}>
            <Text style={styles.toggleText} >yes, school</Text>
          </Pressable>
          <Pressable style={[styles.toggleButton, styles.activeButton]}>
            <Text style={styles.toggleTextActive}>no, free time</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Select your age range</Text>
        <Pressable
          style={styles.input}
          onPress={() => setAgeRange('less than 13')}
        >
          <Text style={styles.inputText}>Less than 13</Text>
        </Pressable>

        <Pressable
          style={styles.input}
          onPress={() => setAgeRange('greater than 13')}
        >
          <Text style={styles.inputText}>Greater than 13</Text>
        </Pressable>

        <Text style={styles.label}>What is your parent email?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="example@gmail.com"
          placeholderTextColor="#888"
          value={parentEmail}
          onChangeText={setParentEmail}
        />

        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>START</Text>
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
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  inputText: {
    color: '#000',
    fontSize: 16,
  },
  textInput: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    color: '#000',
  },
  startButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
