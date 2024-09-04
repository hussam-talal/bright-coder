// screens/LearningMode.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header'; // استدعاء Header من الملف المنفصل
import { AuthStackParamList } from '../../lib/routeType'; // Adjust the import path as needed
import { StackNavigationProp } from '@react-navigation/stack';

type LearningModeNavigationProp = StackNavigationProp<AuthStackParamList, 'Multiplayer' | 'ImageRecognitionGames' | 'SinglePlayer'>;
export default function LearningMode() {
  const navigation = useNavigation<LearningModeNavigationProp>();

  return (
    <View style={styles.container}>
      <Header title='Select Learning Mode' />
      {/* <Text style={styles.title}>Select Learning Mode</Text> */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Multiplayer')}>
        <Ionicons name="people-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Multiplayer</Text>
        <Text style={styles.descriptionText}>Compete with friends in real-time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ImageRecognitionGames')}>
        <Ionicons name="image-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Image Recognition Games</Text>
        <Text style={styles.descriptionText}>Learn through visual challenges</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SinglePlayer')}>
        <Ionicons name="person-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Single Player</Text>
        <Text style={styles.descriptionText}>Practice at your own pace</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#6200ea" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#6200ea',
    fontSize: 16,
    marginLeft: 5,
  },
  
});
