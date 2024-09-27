import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createAssignment } from '../../lib/CRUD';
import { AuthStackParamList } from '../../lib/routeType';
import Header from '../../components/Header';

type CreateAssignmentScreenRouteProp = RouteProp<AuthStackParamList, 'CreateAssignmentScreen'>;

const CreateAssignmentScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateAssignmentScreenRouteProp>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');

  const { classId, teacherId } = route.params;

  const handleAddAssignment = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const formattedDate = dueDate.toISOString().split('T')[0];

    const assignmentData = {
      title,
      description,
      due_date: formattedDate,
      class_id: classId,
      teacher_id: teacherId,
    };

    try {
      await createAssignment(assignmentData);
      Alert.alert('Success', 'Assignment created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create assignment');
      console.error('Error creating assignment:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(Platform.OS === 'ios');
    setDueDate(currentDate);
  };
  
  const handleAddMember = () => {
    if (newMember.trim()) {
      setTeamMembers([...teamMembers, newMember]); // إضافة العضو الجديد إلى قائمة الفريق
      setNewMember(''); // إعادة تعيين حقل إدخال العضو الجديد
    } else {
      Alert.alert('Error', 'Please enter a valid team member name.');
    }
  };

  return (
    <View style={styles.container1}>
      <Header title='Create Assignment'/>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Assignment Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter assignment title"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Assignment Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter assignment details"
          placeholderTextColor="#666"
          multiline
        />

        <Text style={styles.label}>Add team members</Text>
        <TextInput
          style={styles.input}
          value={newMember}
          onChangeText={setNewMember}
          placeholder="Add team member"
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>

        {teamMembers.map((member, index) => (
          <Text key={index} style={styles.teamMember}>{member}</Text>
        ))}

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{dueDate ? dueDate.toDateString() : 'Select due date'}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleAddAssignment}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  teamMember: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  dateButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#50BFE6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateAssignmentScreen;
