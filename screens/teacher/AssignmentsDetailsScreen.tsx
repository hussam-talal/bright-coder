import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchAssignmentDetails } from '../../lib/CRUD';  // تأكد من وجود دالة جلب تفاصيل الواجبات في ملف CRUD
import { Assignment } from './type';
import { AuthStackParamList } from '../../lib/routeType';
import Header from '../../components/Header';
type AssignmentDetailRouteProps = RouteProp<AuthStackParamList, 'AssignmentDetailsScreen'>;



const AssignmentsDetailsScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<AssignmentDetailRouteProps>();
    const { assignmentId } = route.params;
  
    const [assignment, setAssignment] = useState<Assignment | null>(null);


    useEffect(() => {
        const loadAssignmentDetails = async () => {
          try {
            const fetchedAssignment = await fetchAssignmentDetails(assignmentId);
            if (fetchedAssignment) {
              setAssignment(fetchedAssignment);
            } else {
              Alert.alert('Error', 'No assignment details found.');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to load assignment details.');
            console.error('Error loading assignment details:', error);
          }
        };
    
        loadAssignmentDetails();
      }, [assignmentId]);
    
  
  

  if (!assignment) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <view style={styles.container1}>
        <Header title='Assignment Details'/>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{assignment.title}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Due Date</Text>
          <Text style={styles.infoText}>{assignment.due_date}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Project Team</Text>
          {/* افترض أنك ستجلب أسماء أعضاء الفريق من قاعدة البيانات */}
          <View style={styles.teamMembers}>
            {/* هذه صورة افتراضية لعضو الفريق */}
            <Text>👤 Member 1</Text>
            <Text>👤 Member 2</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Assignment Details</Text>
      <Text style={styles.description}>{assignment.description}</Text>

      <Text style={styles.sectionTitle}>Assignments Progress</Text>
      <View style={styles.progressContainer}>
        {/* هنا يمكنك وضع عنصر دائري لتمثيل تقدم الواجب */}
        <Text>60%</Text>
      </View>

      <Text style={styles.sectionTitle}>All Assignments</Text>
      {/* افترض أنك لديك قائمة بالواجبات الفرعية */}
      <View style={styles.assignmentList}>
        <TouchableOpacity style={styles.assignmentItem}>
          <Text>User Interviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentItem}>
          <Text>Wireframes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentItem}>
          <Text>Design System</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignmentItem}>
          <Text>Final Mockups</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Assignment</Text>
      </TouchableOpacity>
    </ScrollView>
    </view>
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
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    marginTop: 5,
  },
  teamMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  assignmentList: {
    marginBottom: 20,
  },
  assignmentItem: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AssignmentsDetailsScreen;
