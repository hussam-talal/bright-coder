// DrawerNavigator.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from './lib/supabase'; 
import SettingsStudent from './screens/student/SittingStudent ';
import SettingsScreen from './screens/teacher/SettingsScreen';
import GamesScreen from './screens/student/Games';
import MessagesScreen from './screens/teacher/MessagesScreen';
import NotificationsScreen from './components/NotificationsScreen';
//import BottomTabNavigator from './components/BottomTabNavigator';

interface UserProfile {
  full_name: string;
  avatar_url: string;
  role: string;
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const userId = sessionData?.session?.user?.id;
        if (!userId) throw new Error('User not authenticated');

        const { data: userProfileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        setUserProfile(userProfileData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : (
        userProfile && (
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: userProfile.avatar_url }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userProfile.full_name}</Text>
          </View>
        )
      )}
      {!loading && userProfile && <DrawerItemList {...props} />}
      <TouchableOpacity 
        style={styles.customDrawerItem} 
        onPress={async () => {
          try {
            await supabase.auth.signOut();
            Alert.alert("Logged out", "You have been logged out successfully.");
          } catch (error) {
            if (error instanceof Error) {
              console.error("Failed to sign out:", error.message);
              Alert.alert("Error", error.message || "Failed to sign out. Please try again.");
            } else {
              console.error("Failed to sign out:", error);
              Alert.alert("Error", "An unknown error occurred. Please try again.");
            }
          }
        }}>
        <Ionicons name="log-out-outline" size={22} color="#000" />
        <Text style={styles.customDrawerItemText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const DrawerNavigator = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          throw new Error('Unable to fetch user session.');
        }

        const userId = sessionData.session.user.id;

        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();

        if (profileError) {
          throw new Error('Error fetching user profile.');
        }

        setUserRole(userProfile.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const getSettingsScreen = () => {
    switch (userRole) {
      case 'Student':
        return SettingsStudent;
      case 'Teacher':
        return SettingsScreen;
      case 'Parent':
        return SettingsStudent;
      default:
        return null; 
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#1A3C72',
          width: 240,
        },
        drawerLabelStyle: {
          color: '#FFF',
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={GamesScreen} 
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: () => <Ionicons name="grid-outline" size={22} color="#FFF" />,
        }} 
      />
      <Drawer.Screen 
        name="Games" 
        component={GamesScreen} 
        options={{
          drawerLabel: 'Games',
          drawerIcon: () => <Ionicons name="game-controller-outline" size={22} color="#FFF" />,
        }} 
      />
      <Drawer.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{
          drawerLabel: 'Messages',
          drawerIcon: () => <Ionicons name="chatbubble-outline" size={22} color="#FFF" />,
        }} 
      />
      {getSettingsScreen() && (
        <Drawer.Screen 
          name="Settings" 
          component={getSettingsScreen()} 
          options={{
            drawerLabel: 'Settings',
            drawerIcon: () => <Ionicons name="settings-outline" size={22} color="#FFF" />,
          }} 
        />
      )}
      <Drawer.Screen 
        name="NotificationsScreen" 
        component={NotificationsScreen}  
        options={{
          drawerLabel: 'Notifications',
          drawerIcon: () => <Ionicons name="notifications-outline" size={22} color="#FFF" />,
        }} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1A3C72',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  customDrawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    marginLeft: 15,
  },
  customDrawerItemText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
  },
});

export default DrawerNavigator;
