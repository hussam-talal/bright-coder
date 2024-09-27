// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView
// } from 'react-native';
// import { supabase } from '../../lib/supabase';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../lib/routeType';

// type AddChildScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AddChild'>;

// type Props = {
//   navigation: AddChildScreenNavigationProp;
// };

// const AddChild: React.FC<Props> = ({ navigation }) => {
//   const [childName, setChildName] = useState('');
//   const [email, setEmail] = useState('');
//   const [age, setAge] = useState('');
//   const [grade, setGrade] = useState('');
//   const [learningPreferences, setLearningPreferences] = useState('');
//   const [educationalLevel, setEducationalLevel] = useState('');

//   const handleSave = async () => {
//     if (!childName || !email || !age || !grade ||  !educationalLevel) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     try {
//       const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//       if (sessionError || !sessionData?.session) {
//         throw new Error('Unable to fetch user session.');
//       }

//       const userId = sessionData.session.user.id;

//       const { error } = await supabase.from('children').insert([
//         {
//           full_name: childName,
//           email: email,
//           age: parseInt(age, 10),
//           grade: grade,
//           learning_preferences: learningPreferences,
//           educational_level: educationalLevel,
//           parent_id: userId,
//         },
//       ]);

//       if (error) throw error;

//       Alert.alert('Success', 'Child added successfully!');
//       // Reset form and navigate back
//       setChildName('');
//       setEmail('');
//       setAge('');
//       setGrade('');
//       setLearningPreferences('');
//       setEducationalLevel('');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error adding child:', error);
//       Alert.alert('Error', (error as Error).message || 'Failed to add child.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Add Child</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Enter name"
//             value={childName}
//             onChangeText={setChildName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Age"
//             value={age}
//             onChangeText={setAge}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Grade"
//             value={grade}
//             onChangeText={setGrade}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Learning Preferences"
//             value={learningPreferences}
//             onChangeText={setLearningPreferences}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Educational Level"
//             value={educationalLevel}
//             onChangeText={setEducationalLevel}
//           />

//           <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
//             <Text style={styles.saveButtonText}>
//               <Ionicons name="checkmark-circle" size={18} color="#FFF" /> Save
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.cancelButtonText}>
//               <Ionicons name="close-circle" size={18} color="#6200ea" /> Cancel
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#8A2BE2',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#FFF',
//   },
//   input: {
//     backgroundColor: '#FFF',
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 10,
//     fontSize: 16,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   saveButton: {
//     backgroundColor: '#4B0082',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     backgroundColor: '#FFF',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   cancelButtonText: {
//     color: '#4B0082',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default AddChild;






import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { getAuth } from 'firebase/auth';  // Firebase Auth
import { supabase } from '../../lib/supabase'; // Keep using Supabase for database interaction
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';

type AddChildScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AddChild'>;

type Props = {
  navigation: AddChildScreenNavigationProp;
};

const AddChild: React.FC<Props> = ({ navigation }) => {
  const [childName, setChildName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [learningPreferences, setLearningPreferences] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('');

  const handleSave = async () => {
    if (!childName || !email || !age || !grade ||  !educationalLevel) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // الحصول على معرف المستخدم من Firebase
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('User is not logged in.');
      }

      const userId = currentUser.uid;

      // إدراج الطفل في قاعدة بيانات Supabase
      const { error } = await supabase.from('children').insert([
        {
          full_name: childName,
          email: email,
          age: parseInt(age, 10),
          grade: grade,
          learning_preferences: learningPreferences,
          educational_level: educationalLevel,
          parent_id: userId,  // استخدام معرف الوالد من Firebase
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Child added successfully!');
      // Reset form and navigate back
      setChildName('');
      setEmail('');
      setAge('');
      setGrade('');
      setLearningPreferences('');
      setEducationalLevel('');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding child:', error);
      Alert.alert('Error', (error as Error).message || 'Failed to add child.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Child</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={childName}
            onChangeText={setChildName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Grade"
            value={grade}
            onChangeText={setGrade}
          />
          <TextInput
            style={styles.input}
            placeholder="Learning Preferences"
            value={learningPreferences}
            onChangeText={setLearningPreferences}
          />
          <TextInput
            style={styles.input}
            placeholder="Educational Level"
            value={educationalLevel}
            onChangeText={setEducationalLevel}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              <Ionicons name="checkmark-circle" size={18} color="#FFF" /> Save
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>
              <Ionicons name="close-circle" size={18} color="#6200ea" /> Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddChild;
