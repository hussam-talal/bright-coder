import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createChallenge } from '../../lib/CRUD'; 
import { AuthStackParamList } from '../../lib/routeType'; 
import Header from '../../components/Header';

type CreateChallengeScreenRouteProp = RouteProp<AuthStackParamList, 'CreateChallengeScreen'>;

interface ChallengeInput {
  title: string;
  description: string;
  difficulty_level: string;
  challenge_type: string;
  created_by: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive';
  due_date?: string;
}

const CreateChallengeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateChallengeScreenRouteProp>();
  const { teacherId } = route.params;  // Ensure teacherId is correctly retrieved from route params

  // Regular Expression to Validate UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [difficultyLevel, setDifficultyLevel] = useState<string>(''); 
  const [challengeType, setChallengeType] = useState<string>(''); 
  const [startDate, setStartDate] = useState<Date | undefined>(undefined); 
  const [endDate, setEndDate] = useState<Date | undefined>(undefined); 
  const [isActive, setIsActive] = useState<boolean>(true);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined, dateSetter: React.Dispatch<React.SetStateAction<Date | undefined>>) => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    if (selectedDate) {
      dateSetter(selectedDate);
    }
  };

  const handleCreateChallenge = async () => {
    if (!title || !description || !difficultyLevel || !challengeType || !startDate || !endDate) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Validate teacherId format
    if (!uuidRegex.test(teacherId)) {
      Alert.alert('Error', 'Invalid teacher ID format.');
      return;
    }

    try {
      const newChallenge: ChallengeInput = {
        title,
        description,
        difficulty_level: difficultyLevel, 
        challenge_type: challengeType, 
        created_by: teacherId,  // Validated teacher ID
        start_date: startDate.toISOString(), 
        end_date: endDate.toISOString(), 
        status: isActive ? 'active' : 'inactive',
        due_date: endDate.toISOString()  // Set due date same as end date for simplicity
      };

      await createChallenge(newChallenge);
      Alert.alert('Success', 'Challenge created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating challenge:', error);
      Alert.alert('Error', 'Failed to create challenge');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container1} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title='Create Challenge'/>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder="Challenge Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Challenge Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Difficulty Level"
          value={difficultyLevel}
          onChangeText={setDifficultyLevel}
        />

        <TextInput
          style={styles.input}
          placeholder="Challenge Type"
          value={challengeType}
          onChangeText={setChallengeType}
        />

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.input}>
          <Text>{startDate ? startDate.toDateString() : "Select Start Date"}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, setStartDate)}
          />
        )}

        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.input}>
          <Text>{endDate ? endDate.toDateString() : "Select End Date"}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, setEndDate)}
          />
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Active</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateChallenge}>
            <Text style={styles.buttonText}>Create Challenge</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
  },
  scrollView: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateChallengeScreen;
