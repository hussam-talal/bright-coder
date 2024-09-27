import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { fetchMessages, sendMessage, fetchConversations, searchUsers } from '../../lib/CRUD';
import Header from '../../components/Header'; 
import { useAuth } from './AuthContext'; 
import ChatConversationScreen from './ChatConversationScreen';
import * as Notifications from 'expo-notifications'; 
import { supabase } from '../../lib/supabase';
import { getAuth } from 'firebase/auth';

interface User {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
}
interface Conversation {
  id: number;
  student_id: string;
  student_name: string;
  student_avatar: string;
  last_message: string;
  timestamp: string;
}

interface Message {
  id: number;
  conversation_id: number;
  text: string;
  sender_name: string;
  sender_avatar: string;
  is_teacher: boolean;
  created_at: string;
}

type MessagesScreenProps = StackScreenProps<AuthStackParamList, 'Messages'>;

const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const { user } = useAuth();

  



const loadConversations = useCallback(async () => {
  setLoadingConversations(true);
  try {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      throw new Error('User not logged in.');
    }

    const fetchedConversations = await fetchConversations(firebaseUser.uid);
    console.log('Fetched Conversations:', fetchedConversations); // عرض المحادثات في وحدة التحكم
    setConversations(fetchedConversations);
  } catch (error) {
    console.error('Failed to load conversations:', error);
  } finally {
    setLoadingConversations(false);
  }
}, []);

  

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
    }
  }, [selectedConversation]);

  const loadMessages = async () => {
    if (selectedConversation) {
      setLoadingMessages(true);
      try {
        const fetchedMessages = await fetchMessages(selectedConversation.id);
        
        if (fetchedMessages.length > messages.length) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "New Message",
              body: "You have received a new message.",
              data: { conversationId: selectedConversation.id },
            },
            trigger: null,
          });
        }

        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredUsers([]);
    } else {
      try {
        const users = await searchUsers(text);
        setFilteredUsers(users);
      } catch (error) {
        console.error('Failed to search users:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (selectedConversation && messageText.trim()) {
      try {
        await sendMessage(selectedConversation.id, messageText, true);
        setMessageText('');
        const updatedMessages = await fetchMessages(selectedConversation.id);
        setMessages(updatedMessages);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        navigation.navigate('ChatConversationScreen', { conversationId: item.id.toString() }); 

        console.log('User selected:', item.full_name);
      }}
    >
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userUsername}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );


  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => {
        setSelectedConversation(item);
        navigation.navigate('ChatConversationScreen', { conversationId: item.id.toString() });
      }}
    >
      <Image source={{ uri: item.student_avatar }} style={styles.avatar} />
      <View style={styles.conversationDetails}>
        <Text style={styles.conversationName}>{item.student_name}</Text>
        <Text style={styles.lastMessage}>{item.last_message}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>

    </TouchableOpacity>
    
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={item.is_teacher ? styles.teacherMessage : styles.studentMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (loadingConversations) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Messages" />

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          style={styles.userList}
        />
        
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.conversationList}
        />
      )}

      {selectedConversation && (
        <View style={styles.messageContainer}>
          {loadingMessages ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type your message..."
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="send-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    margin: 10,
    fontSize: 16,
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userUsername: {
    color: '#666',
    marginTop: 4,
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 8,
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    color: '#999',
    marginTop: 4,
    fontSize: 12,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  teacherMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A557F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  studentMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAEAEA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  messageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFF',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#A557F5',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;
