
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, ScrollView, Switch,Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../..//lib/routeType'; 

type CreateClassScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateClass'>;

type Props = {
  navigation: CreateClassScreenNavigationProp;
};

type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const CreateClassScreen = ({ navigation }: Props) => {
  const [className, setClassName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<Record<Day, boolean>>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const toggleDay = (day: Day) => {
    setSelectedDays((prevDays) => ({
      ...prevDays,
      [day]: !prevDays[day],
    }));
  };

  const handleCreateClass = () => {
    if (!className) {
      Alert.alert('Error', 'Please enter the class name.');
      return;
    }
    
    if (!capacity) {
      Alert.alert('Error', 'Please enter the student capacity.');
      return;
    }

    navigation.navigate('NextCreateClass', { 
      className, 
      capacity, 
      description, 
      selectedDays 
    });
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Class</Text>

      <TextInput
        style={styles.input}
        placeholder="Class Name"
        value={className}
        onChangeText={setClassName}
      />

      <TextInput
        style={styles.input}
        placeholder="Student Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter class description here"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Image
        source={{ uri: 'https://via.placeholder.com/150' }}
        style={styles.image}
      />
      <Pressable style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </Pressable>

      <View style={styles.checkboxContainer}>
        {Object.keys(selectedDays).map((day) => (
          <View key={day} style={styles.checkboxItem}>
            <Switch
              value={selectedDays[day as Day]}
              onValueChange={() => toggleDay(day as Day)}
            />
            <Text>{day}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.createButton} onPress={handleCreateClass}>
        <Text style={styles.createButtonText}>Create Class</Text>
      </Pressable>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#A557F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#A557F5',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CreateClassScreen;
