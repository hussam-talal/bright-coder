import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { fetchLiveSessions, deleteLiveSession } from '../../lib/CRUD'; // Adjust path accordingly
import { LiveSessionType } from '../../lib/routeType'; // Adjust the import path accordingly

const LiveSessions: React.FC = () => {
  const [sessions, setSessions] = useState<LiveSessionType[]>([]); // Correct type for state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLiveSessions();
  }, []);

  const loadLiveSessions = async () => {
    try {
      setLoading(true);
      const data = await fetchLiveSessions();
      setSessions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load live sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (sessionId: number) => {
    // Logic to join a session
    Alert.alert('Join Session', `You have joined session ${sessionId}`);
  };

  const handleCancelSession = async (sessionId: number) => {
    try {
      await deleteLiveSession(sessionId);
      Alert.alert('Success', 'Session cancelled successfully.');
      loadLiveSessions(); // Reload sessions after deletion
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel session.');
    }
  };

  const renderItem = ({ item }: { item: LiveSessionType }) => (
    <View style={styles.sessionCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.sessionDate}>{`${item.scheduled_at}`}</Text>
          <Text style={styles.sessionDescription}>{item.description}</Text>
        </View>
        {item.image && <Image source={{ uri: item.image }} style={styles.sessionImage} />}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinSession(item.id)}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelSession(item.id)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Live Sessions</Text>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadLiveSessions}
      />
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
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionDate: {
    color: 'gray',
    marginTop: 5,
  },
  sessionDescription: {
    color: 'gray',
    marginTop: 5,
  },
  sessionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  joinButton: {
    backgroundColor: '#0000FF',
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF69B4',
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default LiveSessions;
