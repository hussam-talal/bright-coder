import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabase';

interface ParentProfile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  avatar_url: string;
}

const ProfileParent: React.FC = () => {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError || !sessionData?.session) {
        throw new Error('Unable to fetch user session.');
      }
  
      const userId = sessionData.session.user.id;
  
      const { data: userData, error: userError } = await supabase.auth.getUser(userId);
  
      if (userError || !userData?.user) {
        throw new Error('Error fetching user email.');
      }
  
      const userEmail = userData.user.email;
  
      console.log('User ID from session:', userId);
      console.log('Session Data:', sessionData);
  
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, phone,email, city, avatar_url')  
        .eq('id', userId)  
        .single();
  
      if (profileError || !profileData) {
        // Debugging: Log the error to check what went wrong
        console.error('Supabase profile fetch error:', profileError);
        throw new Error('Error fetching parent profile data.');
      }
  
      console.log('Fetched Parent Profile:', profileData);
  
      const formattedProfile: ParentProfile = {
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.city || '',  
        avatar_url: profileData.avatar_url || ''
      };
  
      setProfile(formattedProfile); 
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleSave = async () => {
    try {
      setIsEditing(false);
      // Logic to save the profile can be added here
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {profile?.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}  
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require('../../assets/profile.png')}  // Fallback to a default image if no avatar URL
            style={styles.profileImage}
          />
        )}
        <TouchableOpacity style={styles.editPictureButton}>
          <Text style={styles.editPictureText}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profile?.full_name || ''}
            onChangeText={(text) => setProfile({ ...profile!, full_name: text })}
            editable={isEditing}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile?.email || ''}
            onChangeText={(text) => setProfile({ ...profile!, email: text })}
            editable={isEditing}
            keyboardType="email-address"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profile?.phone || ''}
            onChangeText={(text) => setProfile({ ...profile!, phone: text })}
            editable={isEditing}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profile?.address || ''}
            onChangeText={(text) => setProfile({ ...profile!, address: text })}
            editable={isEditing}
          />
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editPictureButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editPictureText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  editButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileParent;
