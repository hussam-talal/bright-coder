// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { fetchNotifications } from '../lib/CRUD';  
// import { supabase } from '../lib/supabase'; 
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../lib/routeType';  
// import { getAuth } from 'firebase/auth';

// type HeaderNavigationProp = StackNavigationProp<AuthStackParamList>;

// interface HeaderProps {
//   title: string;
// }

// const Header: React.FC<HeaderProps> = ({ title }) => {
//   const navigation = useNavigation<HeaderNavigationProp>();
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   // Fetch notifications and user role on component load
//   useEffect(() => {
//     const fetchNotificationCount = async () => {
//       try {
//         const notifications = await fetchNotifications();
//         const unreadNotifications = notifications?.filter(notification => !notification.read) || [];
//         setNotificationCount(unreadNotifications.length);
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     const fetchUserRole = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user) {
//           throw new Error('User not logged in');
//         }

//         const userId = user.uid;

//         const { data: profileData, error: profileError } = await supabase
//           .from('profiles')  // Adjust table name as per your structure
//           .select('role')
//           .eq('id', userId)
//           .single();

//         if (profileError) throw profileError;

//         setUserRole(profileData.role);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//         Alert.alert('Error', 'Failed to fetch user role.');
//       }
//     };

//     fetchNotificationCount();
//     fetchUserRole();
//   }, []);

//   // Function to handle profile picture click
//   const handleProfilePress = () => {
//     if (!userRole) {
//       Alert.alert('Error', 'User role not found.');
//       return;
//     }

//     // Navigate to the correct profile screen based on the user's role
//     switch (userRole) {
//       case 'Student':
//         navigation.navigate('ProfileStudent');  // Adjust screen name if needed
//         break;
//       case 'Teacher':
//         navigation.navigate('ProfileTeacher');  // Adjust screen name if needed
//         break;
//       case 'Parent':
//         navigation.navigate('ProfileParent');   // Adjust screen name if needed
//         break;
//       default:
//         Alert.alert('Error', 'Invalid user role.');
//     }
//   };

//   // Function to handle notifications button click
//   const handleNotificationsPress = () => {
//     navigation.navigate('NotificationsScreen');  // Adjust the name of the notifications screen
//   };

//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={handleProfilePress}>
//         <Image
//           source={require('../assets/profile.png')}  // Replace with dynamic profile image if needed
//           style={styles.avatar}
//         />
//       </TouchableOpacity>
//       <Text style={styles.headerText}>{title}</Text>
//       <View style={styles.headerIcons}>
//         <TouchableOpacity onPress={handleNotificationsPress} style={styles.notificationButton}>
//           <Ionicons name="notifications-outline" style={styles.icon} />
//           {notificationCount > 0 && (
//             <View style={styles.badge}>
//               <Text style={styles.badgeText}>{notificationCount}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Ionicons name="globe-outline" style={styles.icon} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#AF4BC8',
//     padding: 20,
//     paddingTop: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomLeftRadius: 30,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFF',
//     marginLeft: 10,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 25,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     fontSize: 24,
//     color: '#FFF',
//     marginLeft: 15,
//   },
//   notificationButton: {
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     right: -5,
//     top: -5,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });

// export default Header;



import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, Pressable, I18nManager } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchNotifications } from '../lib/CRUD';  
import { supabase } from '../lib/supabase'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../lib/routeType';  
import { getAuth } from 'firebase/auth';
import { useTranslation } from 'react-i18next'; 
import * as Updates from 'expo-updates'; // لإعادة تحميل التطبيق بعد تغيير اللغة

type HeaderNavigationProp = StackNavigationProp<AuthStackParamList>;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [notificationCount, setNotificationCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const { t, i18n } = useTranslation(); // استخدام الترجمة

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const notifications = await fetchNotifications();
        const unreadNotifications = notifications?.filter(notification => !notification.read) || [];
        setNotificationCount(unreadNotifications.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not logged in');
        }

        const userId = user.uid;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        setUserRole(profileData.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        Alert.alert('Error', 'Failed to fetch user role.');
      }
    };

    fetchNotificationCount();
    fetchUserRole();
  }, []);

  const handleProfilePress = () => {
    if (!userRole) {
      Alert.alert('Error', 'User role not found.');
      return;
    }

    switch (userRole) {
      case 'Student':
        navigation.navigate('ProfileStudent');
        break;
      case 'Teacher':
        navigation.navigate('ProfileTeacher');
        break;
      case 'Parent':
        navigation.navigate('ProfileParent');
        break;
      default:
        Alert.alert('Error', 'Invalid user role.');
    }
  };

  const handleNotificationsPress = () => {
    navigation.navigate('NotificationsScreen');
  };

  const handleLanguageChange = async (language: string) => {
    await i18n.changeLanguage(language); // تغيير اللغة باستخدام i18n
    const isRTL = language === 'ar'; // إذا كانت اللغة العربية، اجعل الاتجاه RTL

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL); // ضبط الاتجاه بناءً على اللغة
      Updates.reloadAsync(); // إعادة تحميل التطبيق لتطبيق التغييرات
    }

    setIsLanguageModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleProfilePress}>
        <Image
          source={require('../assets/profile.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{t('Welcome')}</Text> 
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={handleNotificationsPress} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" style={styles.icon} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLanguageModalVisible(true)}>
          <Ionicons name="globe-outline" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            <Pressable style={styles.modalButton} onPress={() => handleLanguageChange('en')}>
              <Text style={styles.modalButtonText}>{t('English')}</Text> 
            </Pressable>
            <Pressable style={styles.modalButton} onPress={() => handleLanguageChange('ar')}>
              <Text style={styles.modalButtonText}>{t('Arabic')}</Text> 
            </Pressable>
            <Pressable style={[styles.modalButton, styles.closeButton]} onPress={() => setIsLanguageModalVisible(false)}>
              <Text style={styles.modalButtonText}>{t('Cancel')}</Text> 
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#AF4BC8',
    padding: 20,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#FFF',
    marginLeft: 15,
  },
  notificationButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#AF4BC8',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'gray',
  },
});

export default Header;
