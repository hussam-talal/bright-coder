import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType'; 
import { supabase } from '../../lib/supabase'; 

type NextCreateClassScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'NextCreateClass'>;

type Props = {
  navigation: NextCreateClassScreenNavigationProp;
  route: {
    params: {
      className: string;
      capacity: string;
      description: string;
      selectedDays: Record<string, boolean>;
    };
  };
};

const NextCreateClassScreen = ({ navigation, route }: Props) => {
  const { className, capacity, description, selectedDays } = route.params;
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  function generateClassCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  const handleCompletion = async () => {
    if (!selectedAge || !selectedLevel) {
      Alert.alert('Error', 'Please select both age group and level.');
      return;
    }

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      const classCode = generateClassCode();

      if (userError || !user) {
        throw new Error("Unable to fetch user");
      }

      const { data, error } = await supabase
        .from('classes')
        .insert([
          {
            class_name: className,
            description: description,
            age_group: selectedAge,
            capacity: capacity,
            level: selectedLevel,
            teacher_id: user.user?.id,
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            schedule: JSON.stringify(selectedDays),
            code: classCode,
          },
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Class created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Classes'),
        },
      ]);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Class</Text>

      <Text style={styles.label}>Age</Text>
      <Pressable onPress={() => setSelectedAge('less_than_13')}>
        <Text style={selectedAge === 'less_than_13' ? styles.selected : styles.unselected}>
          Less than 13
        </Text>
      </Pressable>
      <Pressable onPress={() => setSelectedAge('more_than_13')}>
        <Text style={selectedAge === 'more_than_13' ? styles.selected : styles.unselected}>
          More than 13
        </Text>
      </Pressable>

      <Text style={styles.label}>Level</Text>
      <Pressable onPress={() => setSelectedLevel('Beginner')}>
        <Text style={selectedLevel === 'Beginner' ? styles.levelSelected : styles.levelUnselected}>
          Beginner
        </Text>
      </Pressable>
      <Pressable onPress={() => setSelectedLevel('Intermediate')}>
        <Text style={selectedLevel === 'Intermediate' ? styles.levelSelected : styles.levelUnselected}>
          Intermediate
        </Text>
      </Pressable>
      <Pressable onPress={() => setSelectedLevel('Advanced')}>
        <Text style={selectedLevel === 'Advanced' ? styles.levelSelected : styles.levelUnselected}>
          Advanced
        </Text>
      </Pressable>

      <Pressable style={styles.completionButton} onPress={handleCompletion}>
        <Text style={styles.completionText}>Completion</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A557F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 10,
  },
  selected: {
    backgroundColor: '#FFF',
    color: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  unselected: {
    backgroundColor: '#C3B1E1',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  levelSelected: {
    backgroundColor: '#FF6347', // لون مميز للمستوى عند الاختيار
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  levelUnselected: {
    backgroundColor: '#5A67D8',
    color: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  completionButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  completionText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NextCreateClassScreen;
