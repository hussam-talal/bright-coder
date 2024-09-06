
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchConversations } from '../../lib/ChatItems'; 
import { AuthContext } from './AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { RouteProp } from '@react-navigation/native';
import ChatScreen from './ChatScreen';

type ConversationsScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ConversationsScreen'>;
type ConversationsScreenRouteProp = RouteProp<AuthStackParamList, 'ConversationsScreen'>;

type Props = {
  navigation: ConversationsScreenNavigationProp;
  route: ConversationsScreenRouteProp;
};


interface Conversation {
  id: string;
  studentName: string;
  lastMessage: string;
  timestamp: Date;
}

// interface Props {
//   navigation: ConversationsScreenNavigationProp;
//   route: ConversationsScreenRouteProp;
// }

const ConversationsScreen: React.FC<Props> = ({ navigation }) => {

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const authContext = useContext(AuthContext);

  // Ensure the user is not null and is a teacher
  if (!authContext?.user || !authContext.isTeacher) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const { user } = authContext; // Destructure user from context

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('ChatScreen', { conversationId });
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Conversations</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item.id)}
          >
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            <Text style={styles.timestamp}>{item.timestamp.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noConversationsText}>No conversations available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  conversationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  noConversationsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ConversationsScreen;
