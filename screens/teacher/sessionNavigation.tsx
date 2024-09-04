// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import UpcomingSessions from './UpcomingSessions';
// import CreateNewSession from './CreateNewSession'; // Adjust import path

// const Stack = createStackNavigator();

// const sessionNavigator: React.FC = () => {
//   return (
//     <Stack.Navigator initialRouteName="UpcomingSessions">
//       <Stack.Screen
//         name="UpcomingSessions"
//         component={UpcomingSessions}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="CreateNewSession"
//         component={CreateNewSession}
//         options={{ title: 'Create New Session' }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default sessionNavigator;

// SessionNavigator.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UpcomingSessions from './UpcomingSessions';
import CreateNewSession from './CreateNewSession';
import LiveSessions from './liveSessions';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header'; 
import ClassHeader from '../../components/ClassHeader'; // Import ClassHeader
import { AuthStackParamList } from '../../lib/routeType';
import ChatNavigation from './ChatNavigation';
import LiveTeacherScreen from './LiveTeacher';

const Tab = createMaterialTopTabNavigator<AuthStackParamList>();

const SessionNavigator: React.FC = () => {
  const [classData, setClassData] = useState<{ class_name: string; code: string } | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [lessonCount, setLessonCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const classId = 1; // Assume a classId is provided or fetched from state

  const loadClassData = useCallback(async () => {
    try {
      setLoading(true);

      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('class_name, code')
        .eq('id', classId)
        .maybeSingle(); // Use maybeSingle to handle no or multiple rows

      if (classError) {
        throw classError;
      }

      setClassData(classData);

      const { count: studentCount, error: studentError } = await supabase
        .from('class_students')
        .select('id', { count: 'exact' })
        .eq('class_id', classId);

      if (studentError) {
        throw studentError;
      }

      setStudentCount(studentCount || 0);

      const { count: lessonCount, error: lessonError } = await supabase
        .from('class_lessons')
        .select('id', { count: 'exact' })
        .eq('class_id', classId);

      if (lessonError) {
        throw lessonError;
      }

      setLessonCount(lessonCount || 0);
    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    loadClassData();
  }, [loadClassData]);

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header title="Live Session Management" />

      {/* ClassHeader Component */}
      <ClassHeader
        classData={classData}
        studentCount={studentCount}
        lessonCount={lessonCount}
        loading={loading}
      />

      {/* Tab Navigator */}
      <Tab.Navigator
        initialRouteName="UpcomingSessions"
        screenOptions={{
          tabBarActiveTintColor: '#6200EE',
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#6200EE' },
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Tab.Screen
          name="UpcomingSessions"
          component={UpcomingSessions}
          options={{ title: 'Upcoming Sessions' }}
        />
        <Tab.Screen
          name="LiveTeacherScreen"
          component={LiveTeacherScreen}
          options={{ title: 'Live Sessions' }}
        />
        <Tab.Screen name="ChatNavigation" component={ChatNavigation} options={{ title: 'Chat' }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SessionNavigator;
