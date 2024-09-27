
// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
// import { createChildProfile, getChildProfiles, updateChildProfile } from '../../lib/CRUD'; // استيراد وظائف CRUD
// import { supabase } from '../../lib/supabase';
// import { AuthStackParamList } from '../../lib/routeType';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation } from '@react-navigation/native';

// type HomeParentNavigationProp = StackNavigationProp<AuthStackParamList>;


// type ChildData = {
//   parent_id: string;
//   full_name: string;
//   email: string;
//   age: number;
//   grade: string;
//   created_at?: string;
//   updated_at?: string;
// };

// export default function DetailsParent() {
//   const [selectedTab, setSelectedTab] = useState<string>('Create');
//   const [fullName, setFullName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   const [age, setAge] = useState<string>('');
//   const [grade, setGrade] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [childrenProfiles, setChildrenProfiles] = useState<ChildData[]>([]);
//   const navigation = useNavigation<HomeParentNavigationProp>();

//   useEffect(() => {
//     fetchChildProfiles();
//   }, []);

//   const fetchChildProfiles = async () => {
//     try {
//       setLoading(true);
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error) {
//         throw new Error('Error retrieving session');
//       }

//       const parentId = session?.user?.id;

//       if (!parentId) {
//         throw new Error('User is not logged in');
//       }

//       const profiles = await getChildProfiles(parentId);
//       setChildrenProfiles(profiles);
//     } catch (error) {
//       console.error('Error fetching child profiles:', error);
//       Alert.alert('Error', 'Failed to load child profiles.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!fullName || !email || !password || !confirmPassword || !age || !grade) {
//       Alert.alert('Validation Error', 'Please fill all the fields.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Validation Error', 'Passwords do not match.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data: { session }, error } = await supabase.auth.getSession();

//       if (error) {
//         throw new Error('Error retrieving session');
//       }

//       const parentId = session?.user?.id;

//       if (!parentId) {
//         throw new Error('User is not logged in');
//       }

//       const newChild: ChildData = {
//         parent_id: parentId,
//         full_name: fullName,
//         email: email,
//         age: parseInt(age),
//         grade: grade,
//       };

//       await createChildProfile(newChild);
//       Alert.alert('Success', 'Child profile has been created successfully!');
//       fetchChildProfiles(); 
//       navigation.navigate('ParentHome');
//     } catch (error) {
//       console.error('Error saving child profile:', error);
//       Alert.alert('Error', 'An error occurred while saving the child profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLink = async () => {
//     if (!email || !password) {
//       Alert.alert('Validation Error', 'Please enter both email and password.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
//         email: email,
//         password: password,
//       });

//       if (signInError) throw signInError;

//       const childUserId = signInData.user?.id;

//       if (!childUserId) {
//         throw new Error('Child user not found.');
//       }

//       const { data: { session }, error: sessionError } = await supabase.auth.getSession();

//       if (sessionError) {
//         throw new Error('Error retrieving parent session');
//       }

//       const parentId = session?.user?.id;

//       if (!parentId) {
//         throw new Error('Parent is not logged in');
//       }

//       const { error: updateError } = await supabase
//         .from('children')
//         .update({ parent_id: parentId })
//         .eq('id', childUserId);

//       if (updateError) throw updateError;

//       Alert.alert('Success', 'Child profile has been linked successfully!');
//       fetchChildProfiles(); 
//       navigation.navigate('ParentHome');


//     } catch (error) {
//       console.error('Error linking child profile:', error);
//       Alert.alert('Error', 'An error occurred while linking the child profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../../assets/background.png')}
//       style={styles.background}
//     >
//       <View style={styles.container}>
//         <Text style={styles.header}>Add a child profile</Text>
        
//         {/* Tabs for Create and Link */}
//         <View style={styles.tabsContainer}>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'Create' && styles.activeTab]}
//             onPress={() => setSelectedTab('Create')}
//           >
//             <Text style={[styles.tabText, selectedTab === 'Create' && styles.activeTabText]}>Create</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'Link' && styles.activeTab]}
//             onPress={() => setSelectedTab('Link')}
//           >
//             <Text style={[styles.tabText, selectedTab === 'Link' && styles.activeTabText]}>Link</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Form for creating a child profile */}
//         {selectedTab === 'Create' && (
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               placeholderTextColor="#888"
//               value={fullName}
//               onChangeText={setFullName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="email"
//               placeholderTextColor="#888"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="password"
//               placeholderTextColor="#888"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="retype password"
//               placeholderTextColor="#888"
//               secureTextEntry
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//             />
            
//             {/* Age and Grade Inputs */}
//             <View style={styles.row}>
//               <TextInput
//                 style={styles.smallInput}
//                 placeholder="Age"
//                 placeholderTextColor="#888"
//                 value={age}
//                 onChangeText={setAge}
//               />
//               <TextInput
//                 style={styles.smallInput}
//                 placeholder="Grade"
//                 placeholderTextColor="#888"
//                 value={grade}
//                 onChangeText={setGrade}
//               />
//             </View>

//             <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
//               <Text style={styles.saveButtonText}>SAVE</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Form for linking an existing child profile */}
//         {selectedTab === 'Link' && (
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="email"
//               placeholderTextColor="#888"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="password"
//               placeholderTextColor="#888"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />

//             <Pressable style={styles.saveButton} onPress={handleLink} disabled={loading}>
//               <Text style={styles.saveButtonText}>ADD</Text>
//             </Pressable>
//           </View>
//         )}
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
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     color: '#fff',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   tab: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//   },
//   activeTab: {
//     backgroundColor: '#6200ea',
//   },
//   tabText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   formContainer: {
//     width: '100%',
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   smallInput: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: '48%',
//   },
//   saveButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 15,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });





import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { createChildProfile, getChildProfiles, updateChildProfile } from '../../lib/CRUD'; // استيراد وظائف CRUD
import { supabase } from '../../lib/supabase';
import { getAuth } from "firebase/auth"; // استيراد Firebase Auth
import { AuthStackParamList } from '../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type HomeParentNavigationProp = StackNavigationProp<AuthStackParamList>;

type ChildData = {
  parent_id: string;
  full_name: string;
  email: string;
  age: number;
  grade: string;
  created_at?: string;
  updated_at?: string;
};

export default function DetailsParent() {
  const [selectedTab, setSelectedTab] = useState<string>('Create');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [childrenProfiles, setChildrenProfiles] = useState<ChildData[]>([]);
  const navigation = useNavigation<HomeParentNavigationProp>();

  useEffect(() => {
    fetchChildProfiles();
  }, []);

  // استرجاع بروفايلات الأطفال باستخدام Firebase UID
  const fetchChildProfiles = async () => {
    try {
      setLoading(true);
      const user = getAuth().currentUser; // الحصول على المستخدم من Firebase

      if (!user) {
        throw new Error('User is not logged in');
      }

      const parentId = user.uid; // استخدام معرف Firebase

      const profiles = await getChildProfiles(parentId);
      setChildrenProfiles(profiles);
    } catch (error) {
      console.error('Error fetching child profiles:', error);
      Alert.alert('Error', 'Failed to load child profiles.');
    } finally {
      setLoading(false);
    }
  };

  // حفظ بروفايل الطفل الجديد
  const handleSave = async () => {
    if (!fullName || !email || !password || !confirmPassword || !age || !grade) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const user = getAuth().currentUser; // الحصول على المستخدم من Firebase

      if (!user) {
        throw new Error('User is not logged in');
      }

      const parentId = user.uid; // استخدام معرف Firebase

      const newChild: ChildData = {
        parent_id: parentId,
        full_name: fullName,
        email: email,
        age: parseInt(age),
        grade: grade,
      };

      await createChildProfile(newChild);
      Alert.alert('Success', 'Child profile has been created successfully!');
      fetchChildProfiles(); 
      navigation.navigate('ParentHome');
    } catch (error) {
      console.error('Error saving child profile:', error);
      Alert.alert('Error', 'An error occurred while saving the child profile.');
    } finally {
      setLoading(false);
    }
  };

  // ربط بروفايل الطفل الحالي بمعرف الوالد
  const handleLink = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      const childUserId = signInData.user?.id;

      if (!childUserId) {
        throw new Error('Child user not found.');
      }

      const parent = getAuth().currentUser; // الحصول على المستخدم من Firebase

      if (!parent) {
        throw new Error('Parent is not logged in.');
      }
      
      const parentId = parent.uid; // استخدام معرف Firebase
      
      const { error: updateError } = await supabase
        .from('children')
        .update({ parent_id: parentId })
        .eq('id', childUserId);
      
      if (updateError) throw updateError;
      
      Alert.alert('Success', 'Child profile has been linked successfully!');
      fetchChildProfiles(); // لإعادة تحديث القائمة بعد الربط
      
      navigation.navigate('ParentHome');
    } catch (error) {
      console.error('Error linking child profile:', error);
      Alert.alert('Error', 'An error occurred while linking the child profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Add a child profile</Text>
        
        {/* Tabs for Create and Link */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Create' && styles.activeTab]}
            onPress={() => setSelectedTab('Create')}
          >
            <Text style={[styles.tabText, selectedTab === 'Create' && styles.activeTabText]}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'Link' && styles.activeTab]}
            onPress={() => setSelectedTab('Link')}
          >
            <Text style={[styles.tabText, selectedTab === 'Link' && styles.activeTabText]}>Link</Text>
          </TouchableOpacity>
        </View>

        {/* Form for creating a child profile */}
        {selectedTab === 'Create' && (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="retype password"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            {/* Age and Grade Inputs */}
            <View style={styles.row}>
              <TextInput
                style={styles.smallInput}
                placeholder="Age"
                placeholderTextColor="#888"
                value={age}
                onChangeText={setAge}
              />
              <TextInput
                style={styles.smallInput}
                placeholder="Grade"
                placeholderTextColor="#888"
                value={grade}
                onChangeText={setGrade}
              />
            </View>

            <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
              <Text style={styles.saveButtonText}>SAVE</Text>
            </Pressable>
          </View>
        )}

        {/* Form for linking an existing child profile */}
        {selectedTab === 'Link' && (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Pressable style={styles.saveButton} onPress={handleLink} disabled={loading}>
              <Text style={styles.saveButtonText}>ADD</Text>
            </Pressable>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#6200ea',
  },
  tabText: {
    color: '#000',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '48%',
  },
  saveButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});











// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
// import { createChildProfile, getChildProfiles } from '../../lib/CRUD'; 
// import { supabase } from '../../lib/supabase';

// type ChildData = {
//   parent_id: string;
//   full_name: string;
//   email: string;
//   age: number;
//   grade: string;
//   created_at?: string;
//   updated_at?: string;
// };

// export default function DetailsParent() {
//   const [selectedTab, setSelectedTab] = useState<string>('Create');
//   const [fullName, setFullName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [confirmPassword, setConfirmPassword] = useState<string>('');
//   const [age, setAge] = useState<string>('');
//   const [grade, setGrade] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [childrenProfiles, setChildrenProfiles] = useState<ChildData[]>([]);

//   useEffect(() => {
//     fetchChildProfiles();
//   }, []);

//   const fetchChildProfiles = async () => {
//     try {
//       setLoading(true);
//       const { data: { user } } = await supabase.auth.getUser();
//       const parentId = user?.id;
  
//       if (!parentId) throw new Error('User is not logged in');
  
//       const profiles = await getChildProfiles(parentId);
//       setChildrenProfiles(profiles);
//     } catch (error) {
//       console.error('Error fetching child profiles:', error);
//       Alert.alert('Error', 'Failed to load child profiles.');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleSave = async () => {
//     if (!fullName || !email || !password || !confirmPassword || !age || !grade) {
//       Alert.alert('Validation Error', 'Please fill all the fields.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Validation Error', 'Passwords do not match.');
//       return;
//     }

//     setLoading(true);

//     try {
//         const { data: { user } } = await supabase.auth.getUser();
//         const parentId = user?.id;
//       if (!parentId) throw new Error('User is not logged in');

//       const newChild: ChildData = {
//         parent_id: parentId,
//         full_name: fullName,
//         email: email,
//         age: parseInt(age),
//         grade: grade,
//       };
//       await createChildProfile(newChild);
//       Alert.alert('Success', 'Child profile has been created successfully!');
//       fetchChildProfiles(); // تحديث قائمة الأطفال بعد الإضافة
//     } catch (error) {
//       console.error('Error saving child profile:', error);
//       Alert.alert('Error', 'An error occurred while saving the child profile.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/parent-background.png')}
//       style={styles.background}
//     >
//       <View style={styles.container}>
//         <Text style={styles.header}>Add a child profile</Text>
        
//         {/* Tabs for Create and Link */}
//         <View style={styles.tabsContainer}>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'Create' && styles.activeTab]}
//             onPress={() => setSelectedTab('Create')}
//           >
//             <Text style={[styles.tabText, selectedTab === 'Create' && styles.activeTabText]}>Create</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.tab, selectedTab === 'Link' && styles.activeTab]}
//             onPress={() => setSelectedTab('Link')}
//           >
//             <Text style={[styles.tabText, selectedTab === 'Link' && styles.activeTabText]}>Link</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Form for creating a child profile */}
//         {selectedTab === 'Create' && (
//           <View style={styles.formContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               placeholderTextColor="#888"
//               value={fullName}
//               onChangeText={setFullName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="email"
//               placeholderTextColor="#888"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="password"
//               placeholderTextColor="#888"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="retype password"
//               placeholderTextColor="#888"
//               secureTextEntry
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//             />
            
//             {/* Age and Grade Inputs */}
//             <View style={styles.row}>
//               <TextInput
//                 style={styles.smallInput}
//                 placeholder="Age"
//                 placeholderTextColor="#888"
//                 value={age}
//                 onChangeText={setAge}
//               />
//               <TextInput
//                 style={styles.smallInput}
//                 placeholder="Grade"
//                 placeholderTextColor="#888"
//                 value={grade}
//                 onChangeText={setGrade}
//               />
//             </View>

//             <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
//               <Text style={styles.saveButtonText}>SAVE</Text>
//             </Pressable>
//           </View>
//         )}

//         {/* Content for linking an existing profile could go here */}
//         {selectedTab === 'Link' && (
//           <View style={styles.linkContainer}>
//             <Text style={styles.linkText}>Link an existing profile functionality will be here.</Text>
//           </View>
//         )}
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
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   header: {
//     fontSize: 24,
//     color: '#fff',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   tab: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//   },
//   activeTab: {
//     backgroundColor: '#6200ea',
//   },
//   tabText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   formContainer: {
//     width: '100%',
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   smallInput: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     width: '48%',
//   },
//   saveButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 15,
//     borderRadius: 5,
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   linkContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   linkText: {
//     color: '#fff',
//   },
// });
