import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import PrograssClassScreen from '../screens/teacher/prograss';
import LessonsScreen from '../screens/teacher/Lessons'; 
import StudentsClassScreen from '../screens/teacher/StudentsClass'; 
import sessionNavigator from '../screens/teacher/sessionNavigation'; 
import ActivityScreen from '../screens/teacher/ActivityScreen'; 

type NavigationProp = StackNavigationProp<AuthStackParamList>;

type TopBarProps = {
  activeTab: string;
  classId: any; // نوع الخاصية classId
};

const TopBar: React.FC<TopBarProps> = ({ activeTab, classId }) => {
  const navigation = useNavigation<NavigationProp>(); // Fix: Added correct generic type

  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PrograssClass', {classId})}
        style={[styles.tabButton, activeTab === 'Progress' && styles.activeTab]}
      >
        <Text style={styles.tabText}>Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Lessons', { classId })}
        style={[styles.tabButton, activeTab === 'Lessons' && styles.activeTab]}
      >
        <Text style={styles.tabText}>Lessons</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('StudentsClass', { classId })}
        style={[styles.tabButton, activeTab === 'Students' && styles.activeTab]}
      >
        <Text style={styles.tabText}>Students</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.navigate('Activity', { classId })}
        style={[styles.tabButton, activeTab === 'Activity' && styles.activeTab]}
      >
        <Text style={styles.tabText}>Activity</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('sessionNavigator')}
        style={[styles.tabButton, activeTab === 'Live' && styles.activeTab]}
      >
        <Text style={styles.tabText}>Live</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#A557F5',
    padding: 10,
    justifyContent: 'space-around',
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTab: {
    borderBottomColor: '#FFF',
    borderBottomWidth: 2,
  },
});

export default TopBar;
