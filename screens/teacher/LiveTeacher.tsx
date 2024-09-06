import React, { useState, useEffect } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase'; // Make sure your database connection is set up

interface ChatMessage {
  sender: string;
  text: string;
}

const LiveTeacherScreen = () => {
  const [videoCall, setVideoCall] = useState(true);
  const [title, setTitle] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [streamId, setStreamId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState('');

  const connectionData = {
    appId: '94c319d594ee480ab48e162c47caa2e4',
    channel: 'TeacherChannel',
  };

  const rtcCallbacks = {
    EndCall: () => endLiveStream(),
  };

  useEffect(() => {
  const fetchTeacherId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
    } else if (user) {
      setTeacherId(user.id);
    }
  };

  fetchTeacherId();
}, []);


  // Start live stream
  const startLiveStream = async () => {
    setIsLive(true);
    setVideoCall(true);
  
    const { data, error } = await supabase
      .from('live_streams')
      .insert([{ 
        title: title, 
        start_time: new Date(), 
        host: teacherId, 
        status: 'live' 
      }])
      .select()  
      .single();
    
    if (error) {
      console.error('Error starting stream:', error);
    } else if (data && data.id) {
      setStreamId(data.id);
    }
  };
  

  // End live stream
  const endLiveStream = async () => {
    setIsLive(false);
    setVideoCall(false);

    if (streamId) {
      const { error } = await supabase
        .from('live_streams')
        .update({ end_time: new Date(), status: 'ended' })
        .eq('id', streamId);

      if (error) {
        console.error('Error ending stream:', error);
      }
    }
  };

  // Send chat message
  const sendMessage = async () => {
    if (messageText.trim()) {
      setChatMessages([...chatMessages, { sender: 'Teacher', text: messageText }]);
      setMessageText('');
    }
  };

  const updateViewers = () => {
    setViewers(viewers + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateViewers();
    }, 60000);
    return () => clearInterval(interval);
  }, [viewers]);

  return (
    <View style={styles.container}>
      {!isLive ? (
        <View style={styles.setupContainer}>
          <Text style={styles.title}>Start Live Stream</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter stream title"
            value={title}
            onChangeText={setTitle}
          />
          <TouchableOpacity style={styles.startButton} onPress={startLiveStream}>
            <Text style={styles.buttonText}>Start Live Stream</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.liveContainer}>
          <Text style={styles.liveTitle}>{title} (Live)</Text>
          <Text style={styles.viewerCount}>Viewers: {viewers}</Text>

          {videoCall && (
            <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
          )}

          {/* Chat area */}
          <FlatList
            data={chatMessages}
            renderItem={({ item }) => (
              <View style={styles.chatMessage}>
                <Text>{item.sender}: {item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Type your message..."
              value={messageText}
              onChangeText={setMessageText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={{ color: '#fff' }}>Send</Text>
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
    backgroundColor: '#f5f5f5',
  },
  setupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  liveContainer: {
    flex: 1,
    padding: 20,
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewerCount: {
    fontSize: 16,
    marginBottom: 10,
  },
  chatMessage: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  chatInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
  },
});

export default LiveTeacherScreen;







// import React, {useState} from 'react';
// import AgoraUIKit from 'agora-rn-uikit';
// import { Text } from 'react-native';

// const LiveTeacherScreen = () => {
//   const [videoCall, setVideoCall] = useState(true);
//   const connectionData = {
//     appId: '94c319d594ee480ab48e162c47caa2e4',
//     channel: 'Testing',
//   };
//   const rtcCallbacks = {
//     EndCall: () => setVideoCall(false),
//   };
//   return videoCall ? (
//     <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
//   ) : (
//     <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
//   );
// };

// export default LiveTeacherScreen;