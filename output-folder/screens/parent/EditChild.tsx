import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType';

type EditChildScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EditChild'>;
type EditChildScreenRouteProp = RouteProp<AuthStackParamList, 'EditChild'>;

type Props = {
  route: EditChildScreenRouteProp;
  navigation: EditChildScreenNavigationProp;
};

const EditChild: React.FC<Props> = ({ route, navigation }) => {
  const { childId } = route.params;
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [learningPreferences, setLearningPreferences] = useState('');
  const [educationalLevel, setEducationalLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', childId)
          .single();

        if (error) throw error;

        if (data) {
          setChildName(data.full_name);
          setAge(data.age.toString());
          setGrade(data.grade);
          setLearningPreferences(data.learning_preferences);
          setEducationalLevel(data.educational_level);
        }
      } catch (error) {
        console.error('Error fetching child data:', error);
        Alert.alert('Error', 'There was an error fetching the child data.');
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [childId]);

  const handleSave = async () => {
    if (!childName || !age || !grade || !learningPreferences || !educationalLevel) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('children')
        .update({
          full_name: childName,
          age: parseInt(age, 10),
          grade,
          learning_preferences: learningPreferences,
          educational_level: educationalLevel
        })
        .eq('id', childId);

      if (error) throw error;

      Alert.alert('Success', 'Child data updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating child data:', error);
      Alert.alert('Error', 'There was an error updating the child data.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.container}>
      <Text style={styles.title}>Edit Child</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={childName}
        onChangeText={setChildName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Grade"
        value={grade}
        onChangeText={setGrade}
      />

      <TextInput
        style={styles.input}
        placeholder="Learning Preferences"
        value={learningPreferences}
        onChangeText={setLearningPreferences}
      />

      <TextInput
        style={styles.input}
        placeholder="Educational Level"
        value={educationalLevel}
        onChangeText={setEducationalLevel}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" /> Save
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>
          <Ionicons name="close-circle" size={18} color="#6200ea" /> Cancel
        </Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#8A2BE2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditChild;
