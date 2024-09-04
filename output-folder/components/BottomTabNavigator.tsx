

// // استدعاء الصفحات التي ستظهر في الـ bottom navigation


// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import TeacherDashboard from '../screens/teacher/TeacherDashboard';
// import ClassesScreen from '../screens/teacher/ClassesScreen';
// import MessagesScreen from '../screens/teacher/MessagesScreen';
// import SettingsScreen from '../screens/teacher/SettingsScreen';
// import Ionicons from '@expo/vector-icons/Ionicons';

// const Tab = createBottomTabNavigator();

// export default function BottomTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName = '';

//           if (route.name === 'Dashboard') {
//             iconName = 'grid-outline';
//           } else if (route.name === 'Classes') {
//             iconName = 'book-outline';
//           } else if (route.name === 'Messages') {
//             iconName = 'chatbubble-ellipses-outline';
//           } else if (route.name === 'Settings') {
//             iconName = 'settings-outline';
//           }

//           // قم بإرجاع الأيقونة باستخدام Ionicons
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#A557F5',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           paddingBottom: 5,
//           height: 60,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//         },
//       })}
//     >
//       <Tab.Screen name="Dashboard" component={TeacherDashboard} />
//       <Tab.Screen name="Classes" component={ClassesScreen} />
//       <Tab.Screen name="Messages" component={MessagesScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//     </Tab.Navigator>
//   );
// }
