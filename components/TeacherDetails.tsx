import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type AuthStackParamList = {
  TeacherDetails: { userId: string | undefined };
  TeacherDashboard: undefined;
};

type TeacherDetailsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'TeacherDetails'>;
type TeacherDetailsScreenRouteProp = RouteProp<AuthStackParamList, 'TeacherDetails'>;

type Props = {
  navigation: TeacherDetailsScreenNavigationProp;
  route: TeacherDetailsScreenRouteProp;
};

export default function TeacherDetails({ navigation, route }: Props) {
  const [schoolName, setSchoolName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // حالة التحميل

  const handleSaveDetails = async () => {
    const { userId } = route.params;

    // التحقق من الحقول الفارغة
    if (!schoolName || !country || !city || !phone) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true); // تعيين حالة التحميل إلى true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          school_name: schoolName,
          country: country,
          city: city,
          phone: phone,
        })
        .eq('id', userId);

      if (error) throw error;

      // Navigate to Teacher Dashboard
      navigation.navigate('TeacherDashboard');
    } catch (error) {
      console.error('Error updating teacher details:', error);
      Alert.alert('Error', 'Something went wrong while saving your details. Please try again.');
    } finally {
      setLoading(false); // تعيين حالة التحميل إلى false بعد الانتهاء من العملية
    }
  };

  return (
    <ImageBackground
    source={require('../assets/background.png')}
    style={styles.background}
  >
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="School Name"
        value={schoolName}
        onChangeText={setSchoolName}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> 
      ) : (
        <Button title="Save Details" onPress={handleSaveDetails} />
      )}
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
    borderRadius: 7,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',

  },
});
