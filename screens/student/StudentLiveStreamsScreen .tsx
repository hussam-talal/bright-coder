import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase'; 
import AgoraUIKit from 'agora-rn-uikit';
import LottieView from 'lottie-react-native';
import Header from '../../components/Header';

interface Stream {
  id: string;
  title: string;
  host: string;
  start_time: string;
  status: string;
}

const StudentLiveStreamsScreen = () => {
  const [liveStreams, setLiveStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [joined, setJoined] = useState<boolean>(false); 

  const fetchLiveStreams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .eq('status', 'live'); 
    
    if (error) {
      console.error('Error fetching live streams:', error);
    } else {
      setLiveStreams(data);
    }
    setLoading(false);
  };

  const joinStream = (stream: Stream) => {
    setSelectedStream(stream);
    setJoined(true);
  };

  useEffect(() => {
    fetchLiveStreams();
  }, []);

  const connectionData = {
    appId: '94c319d594ee480ab48e162c47caa2e4',
    channel: selectedStream ? selectedStream.id : '', 
  };

  const rtcCallbacks = {
    EndCall: () => setJoined(false),
  };

  return (
    <View style={styles.container1}>
      <Header title="Lives Teachers"/>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {!joined ? (
              liveStreams.length > 0 ? (
                <FlatList
                  data={liveStreams}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.streamContainer}>
                      <Text style={styles.streamTitle}>{item.title}</Text>
                      <Text style={styles.streamHost}>Hosted by: {item.host}</Text>
                      <Text style={styles.streamTime}>Started at: {new Date(item.start_time).toLocaleString()}</Text>
                      <TouchableOpacity style={styles.joinButton} onPress={() => joinStream(item)}>
                        <Text style={styles.joinButtonText}>Join Stream</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <View style={styles.lottieContainer}>
                  <LottieView
                    source={require('../../assets/Animation.json')} 
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                  <Text style={styles.noStreamText}>No Live Streams Available</Text>
                </View>
              )
            ) : (
              <View style={styles.streamViewContainer}>
                <Text style={styles.streamTitle}>Joining {selectedStream?.title}...</Text>
                <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
                <TouchableOpacity style={styles.leaveButton} onPress={() => setJoined(false)}>
                  <Text style={styles.leaveButtonText}>Leave Stream</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  streamContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  streamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  streamHost: {
    fontSize: 14,
    color: '#555',
  },
  streamTime: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  joinButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  streamViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  leaveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lottieContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 200,
    height: 200,
  },
  noStreamText: {
    fontSize: 18,
    marginTop: 20,
    color: '#555',
    textAlign: 'center',
  },
});

export default StudentLiveStreamsScreen;
