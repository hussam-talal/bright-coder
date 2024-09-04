import { IMessage } from 'react-native-gifted-chat';
import { supabase } from './supabase';

// Define a type for the message object
interface Messages {
  id: string;
  text: string;
  is_teacher: boolean;
  created_at: string;
  conversations: {
    student_name: string;
    student_avatar: string;
  } | null;
}

// Define a type for the formatted message used in the chat
interface FormattedMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

// Fetch messages from the database
export const fetchMessages = async (conversationId: number | string): Promise<IMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, text, is_teacher, created_at, conversations(student_name, student_avatar)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    if (!data) {
      console.error("No data received from supabase.");
      return [];
    }

    // Type assertion with error checking to ensure correct type
    return (data as unknown as Messages[]).map((message) => ({
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.created_at),
      user: {
        _id: message.is_teacher ? 'teacher-id' : 'student-id',
        name: message.is_teacher ? 'Teacher Name' : (message.conversations?.student_name || 'Unknown'),
        avatar: message.is_teacher ? 'teacher-avatar-url' : (message.conversations?.student_avatar || 'default-avatar-url'),
      },
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// Send a new message to the database using Supabase
export const sendMessage = async (
  conversationId: number | string, 
  text: string, 
  userId: string, 
  isTeacher: boolean
): Promise<void> => {
  try {
    const { error } = await supabase.from('messages').insert([
      {
        conversation_id: conversationId,
        text: text,
        is_teacher: isTeacher,
        created_at: new Date().toISOString(),
        user_id: userId // Ensure this field exists in your table schema
      },
    ]);

    if (error) {
      console.error('Failed to send message:', error.message);
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Fetch conversations from the API or database
// export const fetchConversations = async () => {
//   try {
//     const { data, error } = await supabase
//       .from('conversations')
//       .select('*');

//     if (error) {
//       throw new Error(`Failed to fetch conversations: ${error.message}`);
//     }

//     return data.map((conversation: any) => ({
//       id: conversation.id,
//       studentId: conversation.student_id,
//       studentName: conversation.student_name,
//       studentAvatar: conversation.student_avatar,
//       lastMessage: conversation.last_message,
//       timestamp: new Date(conversation.timestamp),
//     }));
//   } catch (error) {
//     console.error('Error fetching conversations:', error);
//     throw error;
//   }
// };


interface Conversation {
  id: number;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  timestamp: Date;
}

// Ensure fetchConversations is properly handling errors and returning data
export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*');

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    return [];
  }
};


// Add a new message to the conversation
export const addMessage = async (conversationId: number | string, text: string, isTeacher: boolean) => {
  try {
    const { data, error } = await supabase.from('messages').insert([
      {
        conversation_id: conversationId,
        text: text,
        is_teacher: isTeacher,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to insert message:', error.message);
      throw error;
    }

    console.log('Message inserted successfully:', data);
  } catch (error) {
    console.error('Error inserting message:', error);
    throw error;
  }
};

// Function to add a new profile
export const addProfile = async (id: string, fullName: string, role: string) => {
  try {
    const { data, error } = await supabase.from('profiles').insert([
      {
        id: id,
        full_name: fullName,
        role: role,
      },
    ]);

    if (error) {
      console.error('Failed to insert profile:', error.message);
      throw error;
    }

    console.log('Profile inserted successfully:', data);
  } catch (error) {
    console.error('Error inserting profile:', error);
    throw error;
  }
};
