import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { fetchLiveSessions } from '../../lib/CRUD'; // Adjust path accordingly
import { LiveSessionType } from '../../lib/routeType'; 
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType'; // Import your route types
import LiveTeacherScreen  from '../teacher/LiveTeacher'; 

type UpcomingSessionsNavigationProp = StackNavigationProp<AuthStackParamList>;

const UpcomingSessions: React.FC = () => {
  const navigation = useNavigation<UpcomingSessionsNavigationProp>();
  const [sessions, setSessions] = useState<LiveSessionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleNavigateToLiveTeacher = () => {
    navigation.navigate('LiveTeacherScreen'); 
  };

  useEffect(() => {
    loadUpcomingSessions();
  }, []);

  const loadUpcomingSessions = async () => {
    try {
      setLoading(true);
      const data = await fetchLiveSessions();
      if (data) {
        setSessions(data);
      } else {
        setSessions([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load upcoming sessions.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: LiveSessionType }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionDate}>{new Date(item.scheduled_at).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
        <Text style={styles.sessionTopic}>Topic: {item.title}</Text>
        <Text style={styles.sessionEnrolled}>Enrolled: {item.enrolled || 0}</Text>
        <TouchableOpacity>
          <Text style={styles.detailsLink}>View Details</Text>
        </TouchableOpacity>
      </View>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.sessionImage} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.button} onPress={handleNavigateToLiveTeacher}>
        <Text style={styles.buttonText}>Go to Live Teacher Screen</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Upcoming Sessions</Text>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadUpcomingSessions}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('CreateNewSession')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#800080',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    color: 'gray',
    marginBottom: 5,
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sessionEnrolled: {
    color: 'gray',
    marginBottom: 10,
  },
  detailsLink: {
    color: '#800080',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  sessionImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 10,
  },
  floatingButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 35,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default UpcomingSessions;
