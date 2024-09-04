import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchChallenges, deleteChallenge } from '../../lib/CRUD'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, ChallengesScreenRouteProp } from '../../lib/routeType';
import Header from '../../components/Header';

// Define the Challenge interface
interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  challenge_type: string;
  created_by: string; // UUID
  created_at?: string; // Optional timestamp
  updated_at?: string; // Optional timestamp
  due_date?: string; // Optional Date type if using timestamp
  status?: string; // Add status property to distinguish active and completed challenges
  submissionsCount?: number; // Optional field for number of submissions
}

// Navigation prop type
type ChallengesNavigationProp = StackNavigationProp<AuthStackParamList, 'ChallengesScreen'>;

const ChallengesScreen: React.FC = () => {
  const navigation = useNavigation<ChallengesNavigationProp>();
  const route = useRoute<ChallengesScreenRouteProp>(); // Use route hook to get parameters

  // Destructure route params
  const { classId, teacherId } = route.params;
  
  // State variables
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [pastChallenges, setPastChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      try {
        const challenges = await fetchChallenges(classId); // Use classId in fetch call

        if (challenges && challenges.length) {
          setActiveChallenges(challenges.filter((challenge: Challenge) => challenge.status === 'active'));
          setPastChallenges(challenges.filter((challenge: Challenge) => challenge.status === 'completed'));
        } else {
          setActiveChallenges([]);
          setPastChallenges([]);
        }
        setError(null);
      } catch (error) {
        setError('Failed to load challenges.');
        console.error("Error loading challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [classId]); // Dependency on classId ensures fetch happens when classId changes

  const handleDelete = async (id: number) => {
    try {
      await deleteChallenge(id);
      const challenges = await fetchChallenges(classId);
      setActiveChallenges(challenges.filter((challenge: Challenge) => challenge.status === 'active'));
      setPastChallenges(challenges.filter((challenge: Challenge) => challenge.status === 'completed'));
      Alert.alert('Success', 'Challenge deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete challenge.');
      console.error("Error deleting challenge:", error);
    }
  };

  const renderChallengeItem = (challenge: Challenge, isActive: boolean) => (
    <View style={styles.challengeCard} key={challenge.id}>
      <View style={{ flex: 1 }}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDescription}>{challenge.description}</Text>
        <Text style={styles.challengeSubmissions}>Submissions: {challenge.submissionsCount ?? 0}</Text>
      </View>
      <View style={styles.challengeActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditChallengeScreen', { challengeId: challenge.id })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(challenge.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container1}>
      <Header title='Challenges' />
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {activeChallenges.length > 0 ? (
              activeChallenges.map(challenge => renderChallengeItem(challenge, true))
            ) : (
              <Text style={styles.noChallengesText}>No active challenges available.</Text>
            )}

            <Text style={styles.sectionTitle}>Past Challenges</Text>
            {pastChallenges.length > 0 ? (
              pastChallenges.map(challenge => renderChallengeItem(challenge, false))
            ) : (
              <Text style={styles.noChallengesText}>No past challenges available.</Text>
            )}

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateChallengeScreen', { classId, teacherId })}
            >
              <Text style={styles.createButtonText}>Create Challenge</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#800080',
    padding: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  challengeCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
  },
  challengeSubmissions: {
    fontSize: 12,
    color: '#666',
  },
  challengeActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#50BFE6',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#FF4081',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  noChallengesText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChallengesScreen;
