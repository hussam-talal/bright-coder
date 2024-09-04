import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import CompletedCourses  from '../prograss/CompletedCourses';
import CompletedGames  from '../prograss/completedGames';
import Header from '../../../components/Header';


type CompletedCoursesNavigationProp = StackNavigationProp<AuthStackParamList, 'CompletedCourses'>;
type CompletedGamesNavigationProp = StackNavigationProp<AuthStackParamList, 'CompletedGames'>;

const ProgressStudentScreen = () => {
  const navigation = useNavigation<CompletedCoursesNavigationProp | CompletedGamesNavigationProp>();

  return (
    <View style={styles.container1}>      
      <Header title='Track Progress' />
    <View style={styles.container}>
      <Text style={styles.title}>Track Progress</Text>

      <TouchableOpacity
        style={styles.cardContainer}
         onPress={() => navigation.navigate('CompletedCourses')}
      >
        <Text style={styles.cardText}>Completed Courses</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardContainer}
         onPress={() => navigation.navigate('CompletedGames')}
      >
        <Text style={styles.cardText}>Completed Games</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time Spent</Text>
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Activity Log</Text>
          <Text style={styles.cardText}>Activity: Reading</Text>
          <Text style={styles.cardText}>Duration: 2 hours on 2023-10-15</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Activity Log</Text>
          <Text style={styles.cardText}>Activity: Practice</Text>
          <Text style={styles.cardText}>Duration: 1.5 hours on 2023-10-14</Text>
        </View>
      </View>
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
    backgroundColor: '#e0e0e0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: '#3e3c63',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ProgressStudentScreen;
