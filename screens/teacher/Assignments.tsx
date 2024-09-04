import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchAssignments } from '../../lib/CRUD';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import Header from '../../components/Header';

// Define types for route params and navigation props
type AssignmentsScreenRouteProp = RouteProp<AuthStackParamList, 'Assignments'>;
type AssignmentsNavigationProp = StackNavigationProp<AuthStackParamList, 'Assignments'>;

export interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  class_id: number;
  teacher_id: string;
  created_at?: string;
  updated_at?: string;
  status?: 'completed' | 'ongoing'; // Ensure status is defined
}

const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<AssignmentsNavigationProp>();
  const route = useRoute<AssignmentsScreenRouteProp>(); // Use route to get params with correct typing
  const [completedAssignments, setCompletedAssignments] = useState<Assignment[]>([]);
  const [ongoingAssignments, setOngoingAssignments] = useState<Assignment[]>([]);

  // Destructure route params with proper type assertion
  const { classId, teacherId } = route.params;

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Use actual classId from route params
        const assignments = await fetchAssignments(classId) as Assignment[]; // Make sure fetchAssignments returns Assignment[]

        // Filter assignments based on status
        setCompletedAssignments(assignments.filter((assignment) => assignment.status === 'completed'));
        setOngoingAssignments(assignments.filter((assignment) => assignment.status === 'ongoing'));
      } catch (error) {
        Alert.alert('Error', 'Failed to load assignments.');
        console.error('Error loading assignments:', error);
      }
    };

    loadAssignments();
  }, [classId]);

  const navigateToCreateAssignment = () => {
    if (classId && teacherId) {
      navigation.navigate('CreateAssignmentScreen', { classId, teacherId });
    } else {
      Alert.alert('Error', 'Class ID or Teacher ID is missing.');
    }
  };

  const renderAssignmentItem = (assignment: Assignment) => (
    <View style={styles.assignmentCard} key={assignment.id}>
      <Text style={styles.assignmentTitle}>{assignment.title}</Text>
      <Text style={styles.assignmentDescription}>{assignment.description}</Text>
      <Text style={styles.assignmentDueDate}>Due: {assignment.due_date}</Text>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('AssignmentDetailsScreen', { assignmentId: assignment.id })}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container1}>
        <Header title='Assignments' />

    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Completed Assignments</Text>
        {completedAssignments.map(renderAssignmentItem)}

        <Text style={styles.sectionTitle}>Ongoing Assignments</Text>
        {ongoingAssignments.map(renderAssignmentItem)}
      </ScrollView>

      {/* Floating Action Button for Adding New Assignment */}
      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToCreateAssignment}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: '#800080',
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#666',
  },
  assignmentDueDate: {
    fontSize: 12,
    color: '#666',
  },
  viewDetailsButton: {
    backgroundColor: '#50BFE6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewDetailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#50BFE6',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AssignmentsScreen;
