import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { addLiveSession } from '../../lib/CRUD'; // تأكد من تعديل المسار حسب موقع CRUD
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType'; // استيراد الأنواع المتعلقة بالمسارات
import { Ionicons } from '@expo/vector-icons'; // تأكد من تثبيت أيقونات إكسبو

type CreateNewSessionNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CreateNewSession'
>;

const CreateNewSession: React.FC = () => {
  const navigation = useNavigation<CreateNewSessionNavigationProp>();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [teacherId, setTeacherId] = useState<string>(''); // يفترض أن لديك معرّف المعلم أو يتم جلبه بناءً على المستخدم الحالي
  const [scheduledAt, setScheduledAt] = useState<string>(''); // الصيغة: YYYY-MM-DDTHH:MM:SSZ
  const [status, setStatus] = useState<string>('upcoming');

  const handleCreateSession = async () => {
    if (!title || !description || !teacherId || !scheduledAt) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    try {
      const newSession = {
        title,
        description,
        teacher_id: teacherId,
        scheduled_at: scheduledAt,
        status,
        image: '', // اختياري: يمكنك إضافة منطق لتحميل الصورة
      };

      await addLiveSession(newSession);
      Alert.alert('Success', 'Session created successfully!');
      navigation.goBack(); // الرجوع إلى الجلسات المجدولة بعد الإنشاء
    } catch (error) {
      Alert.alert('Error', 'Failed to create session.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="person-circle-outline" size={50} color="#6200EE" />
        <Text style={styles.header}>Live Session Management</Text>
        <View style={styles.iconsContainer}>
          <Ionicons name="notifications-outline" size={24} color="#6200EE" />
          <Ionicons name="globe-outline" size={24} color="#6200EE" style={{ marginLeft: 15 }} />
        </View>
      </View>

      <Text style={styles.subHeader}>Create New Session</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="time-outline" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Time (HH:MM)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="document-text-outline" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Topic"
          value={scheduledAt}
          onChangeText={setScheduledAt}
          placeholderTextColor="gray"
        />
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="gray"
        multiline
      />

      <TouchableOpacity style={styles.uploadButton}>
        <Ionicons name="cloud-upload-outline" size={24} color="#6200EE" />
        <Text style={styles.uploadText}>Upload Materials</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scheduleButton} onPress={handleCreateSession}>
        <Ionicons name="calendar-outline" size={24} color="white" />
        <Text style={styles.scheduleText}>Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#9c27b0', // لون الخلفية مشابه للتصميم
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  subHeader: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#000000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadText: {
    color: '#6200EE',
    marginLeft: 10,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
  },
  scheduleText: {
    color: '#FFFFFF',
    marginLeft: 10,
  },
});

export default CreateNewSession;






// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import { addLiveSession } from '../../lib/CRUD'; // Adjust the import path to your actual CRUD location
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../lib/routeType'; // Import your route types
// import { Ionicons } from '@expo/vector-icons'; // تأكد من تثبيت Expo Icons لاستخدام الأيقونات

// type CreateNewSessionNavigationProp = StackNavigationProp<
//   AuthStackParamList,
//   'CreateNewSession'
// >;

// const CreateNewSession: React.FC = () => {
//   const navigation = useNavigation<CreateNewSessionNavigationProp>();

//   const [date, setDate] = useState<string>('');
//   const [time, setTime] = useState<string>('');
//   const [topic, setTopic] = useState<string>('');
//   const [description, setDescription] = useState<string>('');

//   const handleCreateSession = async () => {
//     if (!date || !time || !topic || !description) {
//       Alert.alert('Error', 'Please fill all the fields');
//       return;
//     }

//     try {
//       const newSession = {
//         date,
//         time,
//         topic,
//         description,
//       };

//       await addLiveSession(newSession);
//       Alert.alert('Success', 'Session created successfully!');
//       navigation.goBack(); // Go back to UpcomingSessions after creation
//     } catch (error) {
//       Alert.alert('Error', 'Failed to create session.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Create New Session</Text>
//       </View>

//       <View style={styles.inputContainer}>
//         <Ionicons name="calendar-outline" size={24} color="black" />
//         <TextInput
//           style={styles.input}
//           placeholder="Date"
//           value={date}
//           onChangeText={setDate}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Ionicons name="time-outline" size={24} color="black" />
//         <TextInput
//           style={styles.input}
//           placeholder="Time"
//           value={time}
//           onChangeText={setTime}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Ionicons name="text-outline" size={24} color="black" />
//         <TextInput
//           style={styles.input}
//           placeholder="Topic"
//           value={topic}
//           onChangeText={setTopic}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//         />
//       </View>

//       <TouchableOpacity style={styles.uploadButton}>
//         <Ionicons name="cloud-upload-outline" size={24} color="#6200EE" />
//         <Text style={styles.uploadText}>Upload Materials</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.scheduleButton} onPress={handleCreateSession}>
//         <Ionicons name="calendar-outline" size={24} color="white" />
//         <Text style={styles.scheduleText}>Schedule</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#9c27b0',
//   },
//   headerContainer: {
//     marginBottom: 20,
//   },
//   header: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 10,
//     color: '#000000',
//   },
//   textArea: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   uploadText: {
//     color: '#6200EE',
//     marginLeft: 10,
//   },
//   scheduleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#6200EE',
//     padding: 15,
//     borderRadius: 8,
//   },
//   scheduleText: {
//     color: '#FFFFFF',
//     marginLeft: 10,
//   },
// });

// export default CreateNewSession;

