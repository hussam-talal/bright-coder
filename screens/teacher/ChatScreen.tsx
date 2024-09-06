


import React, { useState, useEffect, useCallback, useContext } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { fetchMessages, sendMessage, fetchConversations } from '../../lib/ChatItems';
import { AuthContext } from './AuthContext';
const mockConversations = [
  {
    id: 1,
    studentName: "John Doe",
    studentAvatar: "https://example.com/avatar1.png",
    lastMessage: "Hello!",
    timestamp: new Date(),
  },
  {
    id: 2,
    studentName: "Jane Smith",
    studentAvatar: "https://example.com/avatar2.png",
    lastMessage: "How are you?",
    timestamp: new Date(),
  }
];


interface User {
  _id: string;
  name: string;
}

interface Conversation {
  id: number;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  const authContext = useContext(AuthContext);

  if (!authContext?.user) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const { user, isTeacher } = authContext;
  const currentUser: User = { _id: user.id, name: user.name };

  useEffect(() => {
    const loadConversations = async () => {
      console.log('Loading conversations...');
      setLoading(true);
      try {
        const fetchedConversations = await fetchConversations();
        if (fetchedConversations.length === 0) {
          console.warn('No conversations found.');
        } else {
          console.log('Conversations loaded:', fetchedConversations);
          setConversations(fetchedConversations);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        Alert.alert('Error', 'Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);


  // useEffect(() => {
  //   // Simulate fetching with mock data for testing
  //   setConversations(mockConversations);
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    if (selectedConversation !== null) {
      console.log(`Loading messages for conversation ID: ${selectedConversation}`);
      setLoading(true);
      const loadMessages = async () => {
        try {
          const fetchedMessages = await fetchMessages(selectedConversation);
          if (fetchedMessages.length === 0) {
            console.warn('No messages found for this conversation.');
          } else {
            console.log('Messages loaded:', fetchedMessages);
            setMessages(fetchedMessages);
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
          Alert.alert('Error', 'Failed to load messages. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      loadMessages();
    }
  }, [selectedConversation]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      console.log('Sending new message:', newMessages);
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

      try {
        if (selectedConversation) {
          await sendMessage(selectedConversation, newMessages[0].text, currentUser._id, isTeacher);

          const updatedConversations = conversations.map((conversation) =>
            conversation.id === selectedConversation
              ? { ...conversation, lastMessage: newMessages[0].text, timestamp: new Date() }
              : conversation
          );
          updatedConversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setConversations(updatedConversations);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again later.');
      }
    },
    [selectedConversation, currentUser._id, isTeacher, conversations]
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {selectedConversation === null ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => setSelectedConversation(item.id)}
            >
              <Text style={styles.conversationTitle}>{item.studentName}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
          user={currentUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatScreen;
