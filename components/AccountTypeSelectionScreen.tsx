// import React from 'react';
// import { StyleSheet, View, Text, Pressable, ImageBackground } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

// type AuthStackParamList = {
//   AccountTypeSelection: undefined;
//   Auth: { accountType: string };
// };

// type AccountTypeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'AccountTypeSelection'>;

// export default function AccountTypeSelectionScreen() {
//   const navigation = useNavigation<AccountTypeScreenNavigationProp>();

//   const selectAccountType = (accountType: string) => {
//     navigation.navigate('Auth', { accountType });
//   };

//   return (
//     <ImageBackground
//       source={require('../assets/background.png')}
//       style={styles.background}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome Back!</Text>
//         <Text style={styles.subtitle}>Choose Account Type</Text>

//         <Pressable style={styles.button} onPress={() => selectAccountType('Student')}>
//           <Text style={styles.buttonText}>Student</Text>
//         </Pressable>

//         <Pressable style={styles.button} onPress={() => selectAccountType('Parent')}>
//           <Text style={styles.buttonText}>Parent</Text>
//         </Pressable>

//         <Pressable style={styles.button} onPress={() => selectAccountType('Teacher')}>
//           <Text style={styles.buttonText}>Teacher</Text>
//         </Pressable>
//       </View>
//     </ImageBackground>
//   );
// }

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../lib/routeType'; 

type AccountTypeSelectionScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Auth'>;

export default function AccountTypeSelectionScreen() {
  const navigation = useNavigation<AccountTypeSelectionScreenNavigationProp>();
  const [role, setRole] = useState<string>('');

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    navigation.navigate('Auth', { role: selectedRole });
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.title}>Choose Account Type</Text>

        <Pressable style={styles.button} onPress={() => handleRoleSelection('Student')}>
          <Text style={styles.buttonText}>Student</Text>
          <View style={styles.iconContainer}>
            {/* يمكنك استبدال الصورة بأيقونة الطالب */}
          </View>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleRoleSelection('Parent')}>
          <Text style={styles.buttonText}>Parent</Text>
          <View style={styles.iconContainer}>
            {/* يمكنك استبدال الصورة بأيقونة الوالدين */}
          </View>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleRoleSelection('Teacher')}>
          <Text style={styles.buttonText}>Teacher</Text>
          <View style={styles.iconContainer}>
            {/* يمكنك استبدال الصورة بأيقونة المعلم */}
          </View>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
