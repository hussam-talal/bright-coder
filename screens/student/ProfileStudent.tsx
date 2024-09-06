import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from '../../lib/supabase'; 

interface StudentProfile {
  full_name: string;
  email: string;
  age: string;
  grade: string;
  learning_preferences: string;
  educational_level: string;
  avatar_url: string;
}

const ProfileStudent: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null); 
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
  
      // Fetch session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        throw new Error('Unable to fetch user session.');
      }
  
      const userId = sessionData.session.user.id;
  
      // Fetch parent profile
      const { data: parentProfile, error: parentProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (parentProfileError || !parentProfile) {
        throw new Error('Error fetching parent profile.');
      }
  
      console.log('Parent Profile:', parentProfile); // Debugging line to see parent profile response
  
      // Fetch child profiles based on parent_id
      const { data: profileData, error: profileError } = await supabase
        .from('children')
        .select('full_name, email, age, grade, learning_preferences, educational_level, avatar_url')
        .eq('parent_id', parentProfile.id);
  
      if (profileError || !profileData || profileData.length === 0) {
        throw new Error('No student profiles found for this parent.');
      }
  
      console.log('Student Profile:', profileData); // Debugging line to see child profile response
  
      // Assuming you want to display only the first child, or you can map through the data if there are multiple children
      setProfile(profileData[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleSave = async () => {
    if (!parentId || !profile) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('children')
        .update({
          full_name: profile.full_name,
          email: profile.email,
          age: profile.age,
          grade: profile.grade,
          learning_preferences: profile.learning_preferences,
          educational_level: profile.educational_level,
        })
        .eq('parent_id', parentId);

      if (error) throw error;

      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
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
            source={require('../../assets/profile.png')}  
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

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={profile?.age || ''}
            onChangeText={(text) => setProfile({ ...profile!, age: text })}
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>

        {/* Grade */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Grade</Text>
          <TextInput
            style={styles.input}
            value={profile?.grade || ''}
            onChangeText={(text) => setProfile({ ...profile!, grade: text })}
            editable={isEditing}
          />
        </View>

        {/* Learning Preferences */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Learning Preferences</Text>
          <TextInput
            style={styles.input}
            value={profile?.learning_preferences || ''}
            onChangeText={(text) => setProfile({ ...profile!, learning_preferences: text })}
            editable={isEditing}
          />
        </View>

        {/* Educational Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Educational Level</Text>
          <TextInput
            style={styles.input}
            value={profile?.educational_level || ''}
            onChangeText={(text) => setProfile({ ...profile!, educational_level: text })}
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

export default ProfileStudent;
