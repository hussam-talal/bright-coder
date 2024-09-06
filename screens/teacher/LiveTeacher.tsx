

import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { Text } from 'react-native';

const LiveTeacherScreen = () => {
  const [videoCall, setVideoCall] = useState(true);
  const connectionData = {
    appId: '94c319d594ee480ab48e162c47caa2e4',
    channel: 'Testing',
  };
  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };
  return videoCall ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    <Text onPress={()=>setVideoCall(true)}>Start Call</Text>
  );
};

export default LiveTeacherScreen;