import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { fetchMessages, sendMessage } from '../../lib/CRUD';
import * as Notifications from 'expo-notifications';

type ChatScreenRouteProp = RouteProp<AuthStackParamList, 'ChatConversationScreen'>;
type ChatScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ChatConversationScreen'>;

interface ChatScreenProps {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
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

const ChatConversationScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const { conversationId } = route.params; // نحصل على معرف المحادثة من المعلمات

  useEffect(() => {
    loadMessages();

    // إعداد استقبال الإشعارات
    const subscription = Notifications.addNotificationReceivedListener(response => {
      if (response.request.content.data.conversationId === conversationId) {
        loadMessages(); 
      }
    });

    return () => {
      subscription.remove();
    };
  }, [conversationId]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        await sendMessage(conversationId, messageText, true);
        setMessageText('');
        loadMessages(); // Refresh messages after sending
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={item.is_teacher ? styles.teacherMessage : styles.studentMessage}>
      <Image source={{ uri: item.sender_avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loadingMessages ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messageList}
          inverted 
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
  messageList: {
    flex: 1,
    padding: 10,
  },
  teacherMessage: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
    alignItems: 'center',
  },
  studentMessage: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageContent: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
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

export default ChatConversationScreen;
