import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, Linking } from 'react-native';
import { Input, Button, Icon } from '@rneui/themed';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../lib/supabase';
import { AuthStackParamList } from '../lib/routeType';
import { Session } from '@supabase/supabase-js';

type SignUpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>;
type SignUpScreenRouteProp = RouteProp<AuthStackParamList, 'SignUp'>;

interface SignUpProps {
  navigation: SignUpScreenNavigationProp;
  route: SignUpScreenRouteProp;
}

export default function SignUp({ navigation, route }: SignUpProps) {
  const role = route?.params?.role;

  if (!role) {
    Alert.alert('Error', 'Role is not defined');
    return null;
  }

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;

      const userId = data.user?.id;

      if (userId) {
        await supabase
          .from('profiles')
          .update({ role, full_name: fullName, email: email })
          .eq('id', userId);
      }

      if (role === 'Teacher') {
        navigation.navigate('TeacherDetails',{ userId });
        } else if (role === 'Student') {
        navigation.navigate('AgeSelection');
      } else if (role === 'Parent') {
      navigation.navigate('DetailsParent');
      }

    } catch (error) {
      console.error('Error during sign up:', error);
      Alert.alert('Error', 'Something went wrong during sign up. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    // استدعاء تسجيل الدخول باستخدام Google
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://ccrbhrzmazrwktqixcoh.supabase.co/auth/v1/callback',  
      }
      
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
    } else {
      console.log('Google Sign-In successful:', data);
      if (data?.url) {
        Linking.openURL(data.url);
      } else {
        console.error('No URL returned from Google Sign-In');
      }


    }
  };

  // async function signUpWithEmail() {
  //   setLoading(true)
  //   const {
  //     data: { session },
  //     error,
  //   } = await supabase.auth.signUp({
  //     email: email,
  //     password: password,
  //   })

  //   if (error) Alert.alert(error.message)
  //   if (!session) Alert.alert('Please check your inbox for email verification!')
  //   setLoading(false)
  // }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >

<ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.container}>
        <Text style={styles.title}>SIGN UP</Text>
        <Text style={styles.subtitle}>
          Create Your Account To Embark On Your Educational Adventure
        </Text>

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          leftIcon={{ type: 'font-awesome', name: 'user', color: '#fff' }}
          inputStyle={{ color: '#fff' }}
          placeholderTextColor="#888"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="youremail@gmail.com"
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#fff' }}
          inputStyle={{ color: '#fff' }}
          placeholderTextColor="#888"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#fff' }}
          rightIcon={
            <Icon
              type="font-awesome"
              name={passwordVisible ? 'eye-slash' : 'eye'}
              color="#fff"
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
          inputStyle={{ color: '#fff' }}
          placeholderTextColor="#888"
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#fff' }}
          rightIcon={
            <Icon
              type="font-awesome"
              name={confirmPasswordVisible ? 'eye-slash' : 'eye'}
              color="#fff"
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
          }
          inputStyle={{ color: '#fff' }}
          placeholderTextColor="#888"
          containerStyle={styles.inputContainer}
        />

        <Button
          title="SIGN UP"
          onPress={handleSignUp}
          buttonStyle={styles.signUpButton}
          titleStyle={styles.signUpButtonText}
        />

        <Text style={styles.orText}>Or Sign Up with</Text>

        <Button
          title="Sign Up With Facebook"
          buttonStyle={styles.facebookButton}
          titleStyle={styles.socialButtonText}
          icon={{
            name: 'facebook',
            type: 'font-awesome',
            color: '#fff',
            size: 20,
          }}
          iconContainerStyle={{ marginRight: 10 }}
        />

        <Button
          title="Sign Up With Google"
          onPress={signInWithGoogle}
          buttonStyle={styles.googleButton}
          titleStyle={styles.socialButtonText}
          icon={{
            name: 'google',
            type: 'font-awesome',
            color: '#fff',
            size: 20,
          }}
          iconContainerStyle={{ marginRight: 10 }}
        />

        <Text style={styles.signInText}>
          Already have an Account? <Text style={styles.signInLink} onPress={() => navigation.navigate('Auth',{ role })}>Sign In here</Text>
        </Text>
      </View>
      </ScrollView>
    </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer:{
    flexGrow: 1,
  },
  container: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    marginTop: 30

  },
  title: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#B34AF3',
    paddingVertical: 10,
    borderRadius: 10,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: '#DB4437',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
  signInLink: {
    color: '#B34AF3',
    fontWeight: 'bold',
  },
});










function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

