

import * as React from "react";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image,  StyleSheet,  I18nManager, ActivityIndicator, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer'; // استيراد النوع المناسب
import Auth from "./components/Auth";
import Account from "./components/Account";
import SignUp from "./components/signUp";
import TeacherDetails from "./components/TeacherDetails";
import TeacherDashboard from "./screens/teacher/TeacherDashboard";
import AgeSelectionScreen from "./components/AgeSelectionScreen";
import ClassCodeScreen from "./components/ClassCodeScreen";
import AccountTypeSelectionScreen from "./components/AccountTypeSelectionScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { AuthStackParamList } from './lib/routeType'; 
import ClassesScreen from './screens/teacher/ClassesScreen';
import CreateClassScreen from './screens/teacher/CreateClassScreen';
import NextCreateClass from './screens/teacher/NextCreateClass'; 
// import CodeCombatCourses from './screens/teacher/codecombat'; 
//import Daily, { DailyCall } from '@daily-co/react-native-daily-js';

import PrograssClassScreen from './screens/teacher/prograss';
import LessonsScreen from './screens/teacher/Lessons';
import StudentsClassScreen from './screens/teacher/StudentsClass'; 
import sessionNavigator from './screens/teacher/sessionNavigation'; 

// import TopNavigation from './TopNavigation';
import MessagesScreen from './screens/teacher/MessagesScreen';
import SettingsScreen from './screens/teacher/SettingsScreen';  

import StudentHome from './screens/student/StudentHome'; 
import GamesScreen from './screens/student/Games';  
import LessonsStudentScreen from './screens/student/LessonsStudentScreen';  

import ImageRecognitionGames from './screens/student/games/ImageRecognitionGames'; 
import GameLinksScreen from './screens/student/games/defferentgames'; 
import SinglePlayer from './screens/student/games/singlePlayer'; 
import ProgressStudentScreen from './screens/student/games/prograssStudent'; 
import AdminRecognition from './screens/student/games/AdminRecognition'; 
import OfflineGamesScreen from './screens/student/games/oflinegames'; 
import MultiplayerGamesScreen from './screens/student/games/multiplayergames'; 
import 'react-native-get-random-values';
import { AuthProvider, useAuth } from './screens/teacher/AuthContext'; 
import { AppProvider } from './screens/teacher/AppContext'; 
import { Provider } from 'react-redux';
import { store } from './store/store'; 


import { Text, TouchableOpacity, View } from 'react-native'; 
import { Header, StackScreenProps } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ActivityScreen from "./screens/teacher/ActivityScreen";
import ChatScreen from './screens/teacher/ChatScreen';
import ChatConversationScreen from './screens/teacher/ChatConversationScreen';
import ConversationsScreen from "./screens/teacher/ConversationsScreen";
import AddStudent from "./screens/teacher/AddStudent";
import ClassCode from "./screens/teacher/CodeClass";
import Assignments from "./screens/teacher/Assignments";
import ChallengesScreen from "./screens/teacher/ChallengesScreen";
import CreateAssignmentScreen from "./screens/teacher/CreateAssignmentScreen";
import EditChallengeScreen from "./screens/teacher/EditChallengeScreen";
import CreateChallengeScreen from "./screens/teacher/CreateChallengeScreen";
import AssignmentsDetailsScreen from "./screens/teacher/AssignmentsDetailsScreen";
import LiveTeacherScreen from "./screens/teacher/LiveTeacher"; NotificationsScreen
import NotificationsScreen from "./components/NotificationsScreen";
import { fetchUserProfile } from './lib/CRUD'; 


// import BottomTabNavigator from "./components/BottomTabNavigator";
import * as Notifications from 'expo-notifications';
import AddCourse from "./screens/teacher/AddCourse";
import GamesDiffrentScreen from "./screens/student/games/defferentgames";
import CompletedCourses from "./screens/student/prograss/CompletedCourses";
import CompletedGames from "./screens/student/prograss/completedGames";
import ParentHome from "./screens/parent/ParentHome";
import DetailsParent from "./screens/parent/DetailsParent";
import ActivityParentScreen from "./screens/parent/ActivityParentScreen";
import ProgressParentScreen from "./screens/parent/ProgressParentScreen";
import ControlParentScreen from "./screens/parent/ControlParentScreen";
import ChildManagement from "./screens/parent/ChildManagement";
import EditChild from "./screens/parent/EditChild";
import AddChild from "./screens/parent/AddChild";
import SettingsStudent from "./screens/student/SittingStudent ";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerNavigator from "./DrawerNavigator";
import StarterPage from "./components/StarterPage";
import ProfileStudent from "./screens/student/ProfileStudent";
import StudentLiveStreamsScreen from "./screens/student/StudentLiveStreamsScreen ";

import ProfileParent from "./screens/parent/ProfileParent";      
import ProfileTeacher from "./screens/teacher/ProfileTeacher";
//I18nManager.allowRTL(false);
const isRTL = I18nManager.isRTL;

if (!isRTL) {
   I18nManager.forceRTL(false);
} else {
   I18nManager.forceRTL(true);
}

// إعدادات الإشعارات
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();
const ClassStack = createNativeStackNavigator<AuthStackParamList>();
const GamesStack = createNativeStackNavigator<AuthStackParamList>();
const MessagesTeacherStack = createNativeStackNavigator<AuthStackParamList>();
const ProgressStudentStack = createNativeStackNavigator<AuthStackParamList>();
const ControlParentStack = createNativeStackNavigator<AuthStackParamList>();

const Drawer = createDrawerNavigator();

interface UserProfile {
  full_name: string;
  avatar_url: string;
  role: string;
}

// function CustomDrawerContent(props) {
//   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//         if (sessionError) throw sessionError;

//         const userId = sessionData?.session?.user?.id;
//         if (!userId) throw new Error('User not authenticated');

//         const { data: userProfileData, error: profileError } = await supabase
//           .from('profiles')
//           .select('full_name, avatar_url, role')
//           .eq('id', userId)
//           .single();
          
//         if (profileError) throw profileError;

//         setUserProfile(userProfileData);
//       } catch (error) {
//         console.error('Failed to fetch user profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <DrawerContentScrollView {...props}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#FFF" />
//       ) : (
//         userProfile && (
//           <View style={styles.profileContainer}>
//             <Image
//               source={{ uri: userProfile.avatar_url }}
//               style={styles.profileImage}
//             />
//             <Text style={styles.profileName}>{userProfile.full_name}</Text>
//           </View>
//         )
//       )}
//       {/* Only display DrawerItemList if there's a user profile loaded */}
//       {!loading && userProfile && <DrawerItemList {...props} />}
//       <TouchableOpacity 
//         style={styles.customDrawerItem} 
//         onPress={async () => {
//           try {
//             await supabase.auth.signOut();
//             Alert.alert("Logged out", "You have been logged out successfully.");
//           } catch (error) {
//             if (error instanceof Error) {
//               console.error("Failed to sign out:", error.message);
//               Alert.alert("Error", error.message || "Failed to sign out. Please try again.");
//             } else {
//               console.error("Failed to sign out:", error);
//               Alert.alert("Error", "An unknown error occurred. Please try again.");
//             }
//           }
//         }}>
//         <Ionicons name="log-out-outline" size={22} color="#000" />
//         <Text style={styles.customDrawerItemText}>Sign Out</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// }

// const DrawerNavigator = () => {
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
//         if (sessionError || !sessionData?.session) {
//           throw new Error('Unable to fetch user session.');
//         }

//         const userId = sessionData.session.user.id;

//         const { data: userProfile, error: profileError } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', userId)
//           .single();

//         if (profileError) {
//           throw new Error('Error fetching user profile.');
//         }

//         setUserRole(userProfile.role);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   const getSettingsScreen = () => {
//     switch (userRole) {
//       case 'Student':
//         return SettingsStudent;
//       case 'Teacher':
//         return SettingsScreen;
//       case 'Parent':
//         return SettingsStudent;
//       default:
//         return null; 
//     }
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <Drawer.Navigator 
//       drawerContent={(props) => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerStyle: {
//           backgroundColor: '#1A3C72',
//           width: 240,
//         },
//         drawerLabelStyle: {
//           color: '#FFF',
//         },
//       }}
//     >
//       {/* Only define drawer items without an initial screen */}
//       <Drawer.Screen 
//         name="Dashboard" 
//         component={BottomTabNavigator} 
//         options={{
//           drawerLabel: 'Dashboard',
//           drawerIcon: () => <Ionicons name="grid-outline" size={22} color="#FFF" />,
//         }} 
//       />
//       <Drawer.Screen 
//         name="Games" 
//         component={GamesScreen} 
//         options={{
//           drawerLabel: 'Games',
//           drawerIcon: () => <Ionicons name="game-controller-outline" size={22} color="#FFF" />,
//         }} 
//       />
//       <Drawer.Screen 
//         name="Messages" 
//         component={MessagesScreen} 
//         options={{
//           drawerLabel: 'Messages',
//           drawerIcon: () => <Ionicons name="chatbubble-outline" size={22} color="#FFF" />,
//         }} 
//       />
//       {getSettingsScreen() && (
//         <Drawer.Screen 
//           name="Settings" 
//           component={getSettingsScreen()} 
//           options={{
//             drawerLabel: 'Settings',
//             drawerIcon: () => <Ionicons name="settings-outline" size={22} color="#FFF" />,
//           }} 
//         />
//       )}
//       <Drawer.Screen 
//         name="NotificationsScreen" 
//         component={NotificationsScreen}  
//         options={{
//           drawerLabel: 'Notifications',
//           drawerIcon: () => <Ionicons name="notifications-outline" size={22} color="#FFF" />,
//         }} 
//       />
//     </Drawer.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   profileContainer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//     backgroundColor: '#1A3C72',
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   profileName: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   customDrawerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     marginVertical: 5,
//     marginLeft: 15,
//   },
//   customDrawerItemText: {
//     marginLeft: 10,
//     color: '#000',
//     fontSize: 16,
//   },
// });



function ClassStackScreen() {
  return (
    <ClassStack.Navigator screenOptions={{headerShown: false}}>
      
        <ClassStack.Screen name ="Classes" component={ClassesScreen} options={{headerShown : false }} />
        <ClassStack.Screen name="CreateClass" component={CreateClassScreen} />
        <ClassStack.Screen name="NextCreateClass" component={NextCreateClass} options={{ headerShown: false }}  /> 
        <ClassStack.Screen name="PrograssClass" component={PrograssClassScreen} options={{ headerShown: false }}
         />
        <ClassStack.Screen
        name="Lessons"
        component={LessonsScreen}
        options={{ headerShown: false }}

      />
      <ClassStack.Screen
        name="StudentsClass"
        component={StudentsClassScreen}
        options={{ headerShown: false }}
        
      />
        <ClassStack.Screen
        name="sessionNavigator"
        component={sessionNavigator}
        options={{ headerShown: false }}
      />
       <ClassStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ headerShown: false }}
      />
      <ClassStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <ClassStack.Screen name="ConversationsScreen" component={ConversationsScreen} />
      <ClassStack.Screen name="AddStudent" component={AddStudent} />
      <ClassStack.Screen name="ClassCode" component={ClassCode} />
      <ClassStack.Screen
        name="Assignments"
        component={Assignments}
        options={{ headerShown: false }}
        
      />
       <ClassStack.Screen
        name="ChallengesScreen"
        component={ChallengesScreen}
        options={{ headerShown: false }}
        
      />

       <ClassStack.Screen
        name="AssignmentDetailsScreen"
        component={AssignmentsDetailsScreen}
        options={{ headerShown: false }}
        
      />
        <ClassStack.Screen
        name="CreateAssignmentScreen"
        component={CreateAssignmentScreen}
        options={{ headerShown: false }}
        
      />
          <ClassStack.Screen
        name="EditChallengeScreen"
        component={EditChallengeScreen}
        options={{ headerShown: false }}
        
      />
        <ClassStack.Screen
        name="CreateChallengeScreen"
        component={CreateChallengeScreen}
        options={{ headerShown: false }}
        
      />


       <ClassStack.Screen
        name="LiveTeacherScreen"

        component={ () => <LiveTeacherScreen />}
        options={{ headerShown: false }}
      />
      
      <ClassStack.Screen
        name="AddCourse"
        component={AddCourse}
        options={{ headerShown: false }}


        
      />
    </ClassStack.Navigator>
  );
}

function GamesStackScreen() {
  return (
    <GamesStack.Navigator screenOptions={{headerShown: false}}>
          <GamesStack.Screen name="GamesScreen" component={GamesScreen} options={{headerShown: false}} />
        <GamesStack.Screen name ="Multiplayer" component={MultiplayerGamesScreen} options={{headerShown : false }} />
        <GamesStack.Screen name="SinglePlayer" component={SinglePlayer} />
        <GamesStack.Screen name="ImageRecognitionGames" component={ImageRecognitionGames} options={{ headerShown: false }}  /> 
        {/* <GamesStack.Screen name="PrograssClass" component={PrograssClassScreen} options={{ headerShown: false }}
         /> */}
        <GamesStack.Screen name="GamesDiffrentScreen" component={GamesDiffrentScreen} options={{ headerShown: false }} />
      <GamesStack.Screen name="AdminRecognition" component={AdminRecognition} options={{ headerShown: false }}  />

      <GamesStack.Screen name="OfflineGamesScreen" component={OfflineGamesScreen} options={{ headerShown: false }} />
            {/* <ClassStack.Screen
        name="CodeCombatCourses"
        component={CodeCombatCourses}
      /> */}

    </GamesStack.Navigator>
  );
}
//ChildManagement

function MessagesTeacherStackScreen() {
  return (
    <MessagesTeacherStack.Navigator screenOptions={{headerShown: false}}>
        <MessagesTeacherStack.Screen name="Messages" component={MessagesScreen} options={{headerShown: false}} />
        <MessagesTeacherStack.Screen name ="ChatConversationScreen" component={ChatConversationScreen} options={{headerShown : false }} />
       
    </MessagesTeacherStack.Navigator>
  );
}

function ControlParentStackScreen() {
  return (
    <ControlParentStack.Navigator screenOptions={{headerShown: false}}>
        <ControlParentStack.Screen name="ChildManagement" component={ChildManagement} options={{headerShown: false}} />
        <ControlParentStack.Screen name ="ControlParentScreen" component={ControlParentScreen} options={{headerShown : false }} />
        <ControlParentStack.Screen name ="AddChild" component={AddChild} options={{headerShown : false }} />
        <ControlParentStack.Screen name ="EditChild" component={EditChild} options={{headerShown : false }} />

    </ControlParentStack.Navigator>
  );
}



function ProgressStudentStackScreen() {
  return (
    <ProgressStudentStack.Navigator screenOptions={{headerShown: false}}>
        <ProgressStudentStack.Screen name="ProgressStudent" component={ProgressStudentScreen} options={{headerShown: false}} />
        <ProgressStudentStack.Screen name ="CompletedCourses" component={CompletedCourses} options={{headerShown : false }} />
        <ProgressStudentStack.Screen name ="CompletedGames" component={CompletedGames} options={{headerShown : false }} />

       
    </ProgressStudentStack.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  
  const [fontsLoaded] = useFonts({
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
    "Lexend-SemiBold": require("./assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Bold": require("./assets/fonts/Lexend-Bold.ttf"),
    "Manrope-Light": require("./assets/fonts/Manrope-Light.ttf"),
    "Manrope-Regular": require("./assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Medium": require("./assets/fonts/Manrope-Medium.ttf"),
    "Manrope-SemiBold": require("./assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("./assets/fonts/Manrope-Bold.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "PlusJakartaSans-Regular": require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("./assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Epilogue-Regular": require("./assets/fonts/Epilogue-Regular.ttf"),
    "Epilogue-Bold": require("./assets/fonts/Epilogue-Bold.ttf"),
    "Epilogue-ExtraBold": require("./assets/fonts/Epilogue-ExtraBold.ttf"),
    "Epilogue-Black": require("./assets/fonts/Epilogue-Black.ttf"),
    "Lato-Light": require("./assets/fonts/Lato-Light.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
  });


  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received!', notification);
    });

    return () => {
      authListener.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  return (
      <Provider store={store}>
        <AppProvider>
        <NavigationContainer>

      {/* {session ? (
        
      ):( */}

        <Stack.Navigator initialRouteName="StarterPage" >
        {/* <DrawerNavigator /> */}
        
          <Stack.Screen 
            name="StarterPage" 
            component={StarterPage} 
            options={{ headerShown: false }} 
          />
           <Stack.Screen 
            name="AccountTypeSelection" 
            component={AccountTypeSelectionScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="SignUp"
            component={SignUp} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Auth" 
            component={Auth} 
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="AgeSelection" 
            component={AgeSelectionScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ClassCodeScreen" 
            component={ClassCodeScreen} 
            options={{ headerShown: false }} 
          />
            <Stack.Screen 
            name="TeacherDetails" 
            component={TeacherDetails}  
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TeacherDashboard" 
            component={BottomTabNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen name="StudentHome" component={BottomTabNavigatorStudent} options={{ headerShown: false }} 
          />
          <Stack.Screen name="DetailsParent" component={DetailsParent} options={{ headerShown: false }} />
          <Stack.Screen name="ParentHome" component={BottomTabNavigatorParent} options={{ headerShown: false }} /> 
          <Stack.Screen name="ProfileStudent" component={ProfileStudent} />
          <Stack.Screen name="ProfileParent" component={ProfileParent} options={{ headerShown: false }} />
          <Stack.Screen name="ProfileTeacher" component={ProfileTeacher} options={{ headerShown: false }} />
          <Stack.Screen name="NotificationsScreen"  component={NotificationsScreen}  
            options={{
              drawerLabel: 'Notifications',
              drawerIcon: () => <Ionicons name="notifications-outline" size={22} color="#FFF" />,
            }} />

          <Stack.Screen 
              name="DrawerNavigator" 
              component={DrawerNavigator} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
          
        {/* // ) : (
        //     <DrawerNavigator />

        //    )} */}
     
      </NavigationContainer>
      </AppProvider>

      </Provider>
          
    );
  }

  const BottomTabNavigator = () => {
    return (
      <Provider store={store}>
            <AuthProvider>


      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === 'Dashboard') {
              iconName = 'grid-outline';
            } else if (route.name === 'Classes') {
              iconName = 'book-outline';
            } else if (route.name === 'Messages') {
              iconName = 'chatbubble-ellipses-outline';
            } else if (route.name === 'Settings') {
              iconName = 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#A557F5',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={TeacherDashboard} options={{headerShown: false}} />
        <Tab.Screen name="Classes" component={ClassStackScreen} options={{headerShown: false}} />

        <Tab.Screen name="Messages" component={MessagesTeacherStackScreen}options={{headerShown: false}} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown: false}} />

      </Tab.Navigator>
      </AuthProvider>

      </Provider>

  );
};

const BottomTabNavigatorStudent = () => {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Games') {
            iconName = 'game-controller-outline';
          } 
          else if (route.name === 'Tutorials') {
            iconName = 'book-outline';
          } 
          else if (route.name === 'Progress') {
            iconName = 'bar-chart-outline';
          } else if (route.name === 'Lessons') {
            iconName = 'school-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A557F5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={StudentHome} options={{headerShown: false}}/>
      <Tab.Screen name="Games" component={GamesStackScreen} options={{headerShown: false}} />

      <Tab.Screen name="Tutorials" component={StudentLiveStreamsScreen}options={{headerShown: false}} />
      <Tab.Screen name="Progress" component={ProgressStudentStackScreen}options={{headerShown: false}} />

      <Tab.Screen name="Lessons" component={LessonsStudentScreen} options={{headerShown: false}} />

    </Tab.Navigator>
  );
};



const BottomTabNavigatorParent = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Dashboard') {
            iconName = 'home-outline';
          } else if (route.name === 'Activities') {
            iconName = 'calendar-outline';
          } 
          else if (route.name === 'Progress') {
            iconName = 'analytics-outline';
          } else if (route.name === 'Control') {
            iconName = 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#A557F5',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
     <Tab.Screen name="Dashboard" component={ParentHome} options={{ headerShown: false }} />
      <Tab.Screen name="Activities" component={ActivityParentScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={ProgressParentScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Control" component={ControlParentStackScreen} options={{ headerShown: false }} />

    </Tab.Navigator>
  );
};

