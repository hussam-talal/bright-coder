


import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from "firebase/auth"; 
import { updateProfile } from '../lib/CRUD'; 
import { supabase } from '../lib/supabase';
import axios from 'axios'; // استيراد Axios لإرسال طلبات HTTP

type AuthStackParamList = {
  ClassCodeScreen: undefined;
};

type AgeSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

export default function AgeSelectionScreen() {
  const navigation = useNavigation<AgeSelectionScreenNavigationProp>();
  const [ageRange, setAgeRange] = useState<string | null>(null);
  const [parentEmail, setParentEmail] = useState('');

  const handleStart = async () => {
    // التأكد من إدخال جميع الحقول
    if (!ageRange || !parentEmail) {
      Alert.alert('Validation Error', 'Please select an age range and enter a parent email.');
      return;
    }

    try {
      // التحقق من وجود البريد الإلكتروني للوالد في قاعدة بيانات Supabase
      const { data: parentData, error: parentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', parentEmail)
        .eq('role', 'Parent')
        .single();

      if (parentError || !parentData) {
        // في حال لم يكن البريد الإلكتروني موجودًا، أرسل دعوة
        await sendEmailToParent(parentEmail);
        Alert.alert('Info', 'Parent email not found. An invitation has been sent to the provided email.');
        return;
      }

      // استخدام Firebase للحصول على المستخدم الحالي
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // تحديث معلومات المستخدم
      const updateError = await updateProfile(user.uid, {
        age_range: ageRange,
        parent_email: parentEmail,
      });

      if (updateError) {
        throw new Error(updateError);
      }

      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('StudentHome');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // دالة لإرسال البريد الإلكتروني باستخدام Mailgun
  const sendEmailToParent = async (email: string) => {
    try {
      const params = new URLSearchParams();
      params.append('from', 'postmaster@sandbox6bd5638ce3144c95af149d8a97c100e2.mailgun.org');
      params.append('to', email);
      params.append('subject', 'You are invited to register');
      params.append('text', 'Hello, you have been invited by your child to register for our app. Please use the following link to sign up.');
  
      const response = await axios.post(
        'https://api.mailgun.net/v3/sandbox6bd5638ce3144c95af149d8a97c100e2.mailgun.org/messages',
        params,
        {
          auth: {
            username: 'api',
            password: 'cdcd3c915406f8353465f3629e89661e-3724298e-d3472651', // مفتاح API من Mailgun
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // تأكد من نوع المحتوى
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Email sent successfully');
      }
    } catch (error:any) {
      console.error('Error sending email:', error.response?.data || error.message);
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
            <Text style={styles.toggleText}>Yes, school</Text>
          </Pressable>
          <Pressable style={[styles.toggleButton, styles.activeButton]}>
            <Text style={styles.toggleTextActive}>No, free time</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Select your age range</Text>
        <Pressable
          style={[styles.input, ageRange === 'less than 13' && styles.selectedInput]} // تطبيق لون مخصص إذا تم اختيار هذا العمر
          onPress={() => setAgeRange('less than 13')}
        >
          <Text style={[styles.inputText, ageRange === 'less than 13' && styles.selectedText]}>Less than 13</Text>
        </Pressable>

        <Pressable
          style={[styles.input, ageRange === 'greater than 13' && styles.selectedInput]} // تطبيق لون مخصص إذا تم اختيار هذا العمر
          onPress={() => setAgeRange('greater than 13')}
        >
          <Text style={[styles.inputText, ageRange === 'greater than 13' && styles.selectedText]}>Greater than 13</Text>
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
  selectedInput: {
    backgroundColor: '#6200ea',  
  },
  selectedText: {
    color: '#fff',  // لون النص عند التحديد
  },
});


