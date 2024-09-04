// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, DrawerActions } from '@react-navigation/native'; // قم بإضافة DrawerActions

// interface HeaderProps {
//   title: string; // تحديد نوع 'title' كـ 'string'
// }

// const Header: React.FC<HeaderProps> = ({ title }) => {
//   const navigation = useNavigation(); // استخدم useNavigation

//   return (
//     <View style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}> 
//         <Image
//           source={require('../assets/profile.png')} // يجب استبدال هذا الرابط برابط الصورة الفعلي للحساب
//           style={styles.avatar}
//         />
//       </TouchableOpacity>
//       <Text style={styles.headerText}>{title}</Text>
//       <View style={styles.headerIcons}>
//         <TouchableOpacity>
//           <Ionicons name="notifications-outline" style={styles.icon} />
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
//     paddingTop: 30,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderBottomLeftRadius: 30,
//   },
//   headerText: {
//     fontSize: 20,
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
// });

// export default Header;









import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { fetchNotifications } from '../lib/CRUD';
import { AuthStackParamList } from '../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
type HeaderNavigationProp = StackNavigationProp<AuthStackParamList>;


interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const notifications = await fetchNotifications();

        if (notifications) {
          const unreadNotifications = notifications.filter(notification => !notification.read);
          setNotificationCount(unreadNotifications.length);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationCount();
  }, []);

  const handleNotificationsPress = () => {
    navigation.navigate('NotificationsScreen'); 
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Image
          source={require('../assets/profile.png')} 
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

