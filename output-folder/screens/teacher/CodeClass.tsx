import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType';
import { supabase } from '../../lib/supabase';

// Define navigation and route props
type ClassCodeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ClassCode'>;
type ClassCodeScreenRouteProp = RouteProp<AuthStackParamList, 'ClassCode'>;

type Props = {
  navigation: ClassCodeScreenNavigationProp;
  route: ClassCodeScreenRouteProp;
};

const ClassCode: React.FC<Props> = ({ route, navigation }) => {
  const { classId } = route.params; // Extract classId from route parameters
  const [classCode, setClassCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch class code from Supabase
    const fetchClassCode = async () => {
      try {
        // Fetch class code from the classes table
        const { data, error } = await supabase
          .from('classes')
          .select('code')
          .eq('id', classId)
          .single(); // Fetch a single row since we expect a unique classId

        if (error) {
          throw error;
        }

        if (data) {
          setClassCode(data.code); // Set the fetched class code
        }
      } catch (error) {
        console.error('Failed to fetch class code:', error);
        Alert.alert('Error', 'Failed to fetch class code.');
      } finally {
        setLoading(false); // Stop loading indicator after fetching data
      }
    };

    fetchClassCode();
  }, [classId]);

  const handleCopyToClipboard = () => {
    if (classCode) {
      Clipboard.setString(classCode); // Copy the class code to the clipboard
      Alert.alert('Copied!', 'Class code copied to clipboard.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share your class Code</Text>
      {classCode ? (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{classCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyToClipboard}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>Class code not found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ClassCode;
