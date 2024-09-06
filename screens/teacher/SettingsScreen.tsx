import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import { useAuth } from '../../screens/teacher/AuthContext'; 
import { supabase } from '../../lib/supabase'; 

export default function TeacherSettings() {
  const { user, signOut } = useAuth(); 
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    classChanges: true,
    studentActivities: true,
    appAnnouncements: false,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('id', user?.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error: any) { // تحديد نوع 'error' كـ 'any'
        console.error('Error fetching profile:', error.message);
        Alert.alert('Error', 'Failed to fetch profile information.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Feature to edit profile coming soon!");
  };

  const handleToggleNotification = async (type: string) => {
    const newValue = !notifications[type as keyof typeof notifications];
    setNotifications((prev) => ({
      ...prev,
      [type]: newValue,
    }));

    try {
      const { error } = await supabase
        .from('notifications_settings')
        .update({ [type]: newValue })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error: any) { // تحديد نوع 'error' كـ 'any'
      console.error('Error updating notification settings:', error.message);
      Alert.alert('Error', 'Failed to update notification settings.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert("Logged out", "You have been logged out successfully.");
    } catch (error: any) { 
      console.error("Failed to sign out:", error.message);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Teacher Settings" />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {profile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Management</Text>
            <View style={styles.profileInfo}>
              <Image 
                source={{ uri: profile.avatar_url }} 
                style={styles.profileAvatar} 
              />
              <View>
                <Text style={styles.profileName}>Name: {profile.full_name}</Text>
                <Text style={styles.profileEmail}>Email: {profile.email}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <View style={styles.notificationPreferences}>
            <View style={styles.notificationItem}>
              <Switch 
                value={notifications.classChanges} 
                onValueChange={() => handleToggleNotification('classChanges')}
              />
              <Text style={styles.notificationText}>Class Changes</Text>
            </View>
            <View style={styles.notificationItem}>
              <Switch 
                value={notifications.studentActivities} 
                onValueChange={() => handleToggleNotification('studentActivities')}
              />
              <Text style={styles.notificationText}>Student Activities</Text>
            </View>
            <View style={styles.notificationItem}>
              <Switch 
                value={notifications.appAnnouncements} 
                onValueChange={() => handleToggleNotification('appAnnouncements')}
              />
              <Text style={styles.notificationText}>App Announcements</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 16,
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#A557F5',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  notificationPreferences: {
    flexDirection: 'column',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
