import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { fetchNotifications } from '../lib/CRUD';  
import { supabase } from '../lib/supabase'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../lib/routeType';  

type HeaderNavigationProp = StackNavigationProp<AuthStackParamList>;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [notificationCount, setNotificationCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch notifications and user role on component load
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
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session) {
          throw new Error('Unable to fetch user session.');
        }

        const userId = sessionData.session.user.id;

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')  // Adjust table name as per your structure
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

  // Function to handle profile picture click
  const handleProfilePress = () => {
    if (!userRole) {
      Alert.alert('Error', 'User role not found.');
      return;
    }

    // Navigate to the correct profile screen based on the user's role
    switch (userRole) {
      case 'Student':
        navigation.navigate('ProfileStudent');  // Adjust screen name if needed
        break;
      case 'Teacher':
        navigation.navigate('ProfileTeacher');  // Adjust screen name if needed
        break;
      case 'Parent':
        navigation.navigate('ProfileParent');   // Adjust screen name if needed
        break;
      default:
        Alert.alert('Error', 'Invalid user role.');
    }
  };

  // Function to handle notifications button click
  const handleNotificationsPress = () => {
    navigation.navigate('NotificationsScreen');  // Adjust the name of the notifications screen
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleProfilePress}>
        <Image
          source={require('../assets/profile.png')}  // Replace with dynamic profile image if needed
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity onPress={handleNotificationsPress} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" style={styles.icon} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="globe-outline" style={styles.icon} />
        </TouchableOpacity>
      </View>
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
});

export default Header;









// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, DrawerActions } from '@react-navigation/native';
// import { fetchNotifications } from '../lib/CRUD';
// import { AuthStackParamList } from '../lib/routeType';
// import { StackNavigationProp } from '@react-navigation/stack';
// type HeaderNavigationProp = StackNavigationProp<AuthStackParamList>;


// interface HeaderProps {
//   title: string;
// }

// const Header: React.FC<HeaderProps> = ({ title }) => {
//   const navigation = useNavigation<HeaderNavigationProp>();
//   const [notificationCount, setNotificationCount] = useState(0);

//   useEffect(() => {
//     const fetchNotificationCount = async () => {
//       try {
//         const notifications = await fetchNotifications();

//         if (notifications) {
//           const unreadNotifications = notifications.filter(notification => !notification.read);
//           setNotificationCount(unreadNotifications.length);
//         } else {
//           setNotificationCount(0);
//         }
//       } catch (error) {
//         console.error('Error fetching notifications:', error);
//       }
//     };

//     fetchNotificationCount();
//   }, []);

//   const handleNotificationsPress = () => {
//     navigation.navigate('NotificationsScreen'); 
//   };

//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//         <Image
//           source={require('../assets/profile.png')} 
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

