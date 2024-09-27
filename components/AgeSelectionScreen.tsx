import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAuth } from "firebase/auth"; // استيراد Firebase auth
import { updateProfile } from '../lib/CRUD'; // استيراد وظيفة تحديث الملفات الشخصية

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
      // استخدام Firebase للحصول على المستخدم الحالي
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // هنا يمكنك تحديث معلومات المستخدم باستخدام UID الخاص بـ Firebase
      const updateError = await updateProfile(user.uid, {
        age_range: ageRange,
        parent_email: parentEmail,
      });

      if (updateError) {
        throw new Error(updateError);
      }

      Alert.alert('Success', 'Profile updated successfully');
      // الانتقال إلى الشاشة التالية
      navigation.navigate('StudentHome');
      
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










// import React, { useState } from 'react';
// import { StyleSheet, View, Text, TextInput, Pressable, ImageBackground, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { supabase } from '../lib/supabase'; // Make sure supabase is properly configured
// import { updateProfile } from '../lib/CRUD'; // Assuming you have a function for updating profiles

// type AuthStackParamList = {
//   ClassCodeScreen: undefined;
// };

// type AgeSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList>;

// export default function AgeSelectionScreen() {
//   const navigation = useNavigation<AgeSelectionScreenNavigationProp>();
//   const [ageRange, setAgeRange] = useState<string | null>(null);
//   const [parentEmail, setParentEmail] = useState('');

//   const handleStart = async () => {
//     // Validate that age range and parent email are provided
//     if (!ageRange || !parentEmail) {
//       Alert.alert('Validation Error', 'Please select an age range and enter a parent email.');
//       return;
//     }

//     try {
//       // Check if the parent email exists and has the role of "Parent"
//       const { data: parentData, error: parentError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('email', parentEmail)
//         .eq('role', 'Parent')
//         .single();

//       if (parentError || !parentData) {
//         Alert.alert('Error', 'Parent email not found or not associated with a Parent role.');
//         return;
//       }

//       // Get the current user (child) from Supabase auth
//       const { data: { user }, error: authError } = await supabase.auth.getUser();

//       if (authError || !user) {
//         Alert.alert('Error', 'User not found');
//         return;
//       }

//       // Update the child's profile with age range and parent email
//       const updateError = await updateProfile(user.id, {
//         age_range: ageRange,
//         parent_email: parentEmail,
//       });

//       if (updateError) {
//         throw new Error(updateError);
//       }

//       Alert.alert('Success', 'Profile updated successfully');
//       // Navigate to the next screen (ClassCodeScreen)
//       navigation.navigate('StudentHome');
      
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/background.png')}
//       style={styles.background}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome Back!</Text>
//         <Text style={styles.subtitle}>Are you using Bright coder at school?</Text>

//         <View style={styles.toggleContainer}>
//           <Pressable style={styles.toggleButton}
//           onPress={() => navigation.navigate('ClassCodeScreen')}>
//             <Text style={styles.toggleText}>Yes, school</Text>
//           </Pressable>
//           <Pressable style={[styles.toggleButton, styles.activeButton]}>
//             <Text style={styles.toggleTextActive}>No, free time</Text>
//           </Pressable>
//         </View>

//         <Text style={styles.label}>Select your age range</Text>
//         <Pressable
//           style={[styles.input, ageRange === 'less than 13' && styles.selectedInput]} // تطبيق لون مخصص إذا تم اختيار هذا العمر
//           onPress={() => setAgeRange('less than 13')}
//         >
//           <Text style={[styles.inputText, ageRange === 'less than 13' && styles.selectedText]}>Less than 13</Text>
//         </Pressable>

//         <Pressable
//           style={[styles.input, ageRange === 'greater than 13' && styles.selectedInput]} // تطبيق لون مخصص إذا تم اختيار هذا العمر
//           onPress={() => setAgeRange('greater than 13')}
//         >
//           <Text style={[styles.inputText, ageRange === 'greater than 13' && styles.selectedText]}>Greater than 13</Text>
//         </Pressable>

//         <Text style={styles.label}>What is your parent email?</Text>
//         <TextInput
//           style={styles.textInput}
//           placeholder="example@gmail.com"
//           placeholderTextColor="#888"
//           value={parentEmail}
//           onChangeText={setParentEmail}
//         />

//         <Pressable style={styles.startButton} onPress={handleStart}>
//           <Text style={styles.startButtonText}>START</Text>
//         </Pressable>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '90%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontWeight: 'bold',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   toggleButton: {
//     flex: 1,
//     paddingVertical: 10,
//     backgroundColor: '#888',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     borderRadius: 10,
//   },
//   activeButton: {
//     backgroundColor: '#6200ea',
//   },
//   toggleText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   toggleTextActive: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   label: {
//     fontSize: 16,
//     color: '#fff',
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//   },
//   input: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   inputText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   textInput: {
//     width: '100%',
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 20,
//     color: '#000',
//   },
//   startButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 15,
//     borderRadius: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   startButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   selectedInput: {
//     backgroundColor: '#6200ea',  
//   },
//   selectedText: {
//     color: '#fff',  // لون النص عند التحديد
//   },
// });
