import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { fetchClasses, fetchStudents, fetchSessions } from '../lib/CRUD';
import Header from '../components/Header'; // تأكد من أن المسار صحيح

import { Ionicons } from '@expo/vector-icons'; 

export default function TeacherDashboard() {
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    async function loadData() {
      const classes = await fetchClasses();
      
      // تأكد من أنك تحصل على classId بطريقة صحيحة قبل تمريره
      const classId = classes.length > 0 ? classes[0].id : null;
  
      if (classId) {
        const students = await fetchStudents(classId); // تمرير classId هنا
        const sessions = await fetchSessions();
  
        setTotalClasses(classes.length);
        setTotalStudents(students.length);
        setTotalSessions(sessions.length);
      } else {
        console.error('No classId found!');
      }
    }
  
    loadData();
  }, []);

  return (
    <View style={styles.container}>
        <Header title="Teacher Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={styles.statistics}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalClasses}</Text>
            <Text style={styles.statLabel}>Total Classes</Text>
            <Text style={styles.statPercent}>75%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalStudents}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
            <Text style={styles.statPercent}>85%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statPercent}>90%</Text>
          </View>
        </View>

        <View style={styles.activities}>
          <Text style={styles.activitiesTitle}>Recent Activities</Text>
          <TouchableOpacity style={styles.activityBox}>
            <Text style={styles.activityTitle}>Javascript Session</Text>
            <Text style={styles.activityDescription}>Held a basic session on algebra.</Text>
            <Text style={styles.activityDate}>Date: Oct 5, 2023</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activityBox}>
            <Text style={styles.activityTitle}>History Review</Text>
            <Text style={styles.activityDescription}>Reviewed assignments on history.</Text>
            <Text style={styles.activityDate}>Date: Oct 3, 2023</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    paddingBottom: 80, // لإعطاء مساحة كافية فوق القائمة السفلية
  },
  
  statistics: {
    padding: 20,
  },
  statBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statPercent: {
    fontSize: 16,
    color: '#F44336',
  },
  activities: {
    padding: 20,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  activityBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 28,
    color: '#A557F5',
  },
  menuItemText: {
    color: '#A557F5',
    fontSize: 14,
  },
});
