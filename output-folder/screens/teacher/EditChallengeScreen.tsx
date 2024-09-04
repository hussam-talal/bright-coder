import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType'; // Adjust the path as needed
import { fetchChallengeById } from '../../lib/CRUD'; // Ensure this function is correctly imported
import { Header } from 'react-native/Libraries/NewAppScreen';

type EditChallengeScreenRouteProp = RouteProp<AuthStackParamList, 'EditChallengeScreen'>;

const EditChallengeScreen: React.FC = () => {
  const route = useRoute<EditChallengeScreenRouteProp>();
  const navigation = useNavigation();
  const { challengeId } = route.params;

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const challenge = await fetchChallengeById(challengeId);
        if (challenge) {
          setTitle(challenge.title ?? ''); // Default to empty string if null
          setDescription(challenge.description ?? ''); // Default to empty string if null
          setDeadline(challenge.due_date ?? ''); // Default to empty string if null
        } else {
          Alert.alert('Error', 'Challenge not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load challenge details.');
        console.error('Error loading challenge:', error);
      }
    };

    loadChallenge();
  }, [challengeId]);

  return (
    <View style={styles.container1}>
        <Header title="Edit Challenge" />

    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Deadline</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
      />

      <Button title="Update Challenge" onPress={() => {/* Handle update logic */}} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
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
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default EditChallengeScreen;
