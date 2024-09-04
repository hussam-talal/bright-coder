// // LiveTeacher.tsx
// import React, { useState, useMemo } from "react";
// import {
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   TextInput,
//   View,
//   FlatList,
//   Clipboard,
// } from "react-native";
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
//   MediaStream,
//   RTCView,
//   Constants,
// } from "@videosdk.live/react-native-sdk";
// import Video from "react-native-video";
// import { createMeeting, authToken } from "./api"; // قم بتعديل المسار وفقًا لموقع دالة createMeeting و authToken



// // نوعية الـprops المستخدمة في JoinScreen
// interface JoinScreenProps {
//   getMeetingAndToken: (id?: string) => void;
//   setMode: React.Dispatch<React.SetStateAction<"CONFERENCE" | "VIEWER">>;
// }

// // نوعية الزر المستخدم في JoinScreen
// interface JoinButtonProps {
//   value: string;
//   onPress: () => void;
// }

// // الشاشة المسؤولة عن الانضمام أو إنشاء الاجتماع
// const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingAndToken, setMode }) => {
//   const [meetingVal, setMeetingVal] = useState<string>("");

//   const JoinButton: React.FC<JoinButtonProps> = ({ value, onPress }) => {
//     return (
//       <TouchableOpacity
//         style={{
//           backgroundColor: "#1178F8",
//           padding: 12,
//           marginVertical: 8,
//           borderRadius: 6,
//         }}
//         onPress={onPress}
//       >
//         <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
//           {value}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "black",
//         justifyContent: "center",
//         paddingHorizontal: 60,
//       }}
//     >
//       <TextInput
//         value={meetingVal}
//         onChangeText={setMeetingVal}
//         placeholder={"XXXX-XXXX-XXXX"}
//         placeholderTextColor={"grey"}
//         style={{
//           padding: 12,
//           borderWidth: 1,
//           borderColor: "white",
//           borderRadius: 6,
//           color: "white",
//           marginBottom: 16,
//         }}
//       />
//       <JoinButton
//         onPress={() => {
//           getMeetingAndToken(meetingVal);
//         }}
//         value={"Join as Host"}
//       />
//       <JoinButton
//         onPress={() => {
//           setMode("VIEWER");
//           getMeetingAndToken(meetingVal);
//         }}
//         value={"Join as Viewer"}
//       />
//       <Text
//         style={{
//           alignSelf: "center",
//           fontSize: 22,
//           marginVertical: 16,
//           fontStyle: "italic",
//           color: "grey",
//         }}
//       >
//         ---------- OR ----------
//       </Text>
//       <JoinButton
//         onPress={() => {
//           getMeetingAndToken();
//         }}
//         value={"Create Studio Room"}
//       />
//     </SafeAreaView>
//   );
// };

// // عرض المشاركين وإدارتهم
// interface ParticipantViewProps {
//   participantId: string;
// }

// const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
//   const { webcamStream, webcamOn } = useParticipant(participantId);
//   return webcamOn && webcamStream ? (
//     <RTCView
//       streamURL={new MediaStream([webcamStream.track]).toURL()}
//       objectFit={"cover"}
//       style={{
//         height: 300,
//         marginVertical: 8,
//         marginHorizontal: 8,
//       }}
//     />
//   ) : (
//     <View
//       style={{
//         backgroundColor: "grey",
//         height: 300,
//         justifyContent: "center",
//         alignItems: "center",
//         marginVertical: 8,
//         marginHorizontal: 8,
//       }}
//     >
//       <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
//     </View>
//   );
// };

// // إدارة التحكم في الاجتماع
// const Controls: React.FC = () => {
//   const { toggleWebcam, toggleMic, startHls, stopHls, hlsState } = useMeeting();

//   const _handleHLS = async () => {
//   if (!hlsState || hlsState === "HLS_STOPPED") {
//     startHls({
//       layout: {
//         type: "GRID" as const,
//         priority: "PIN" as const,
//         gridSize: 4,
//       },
//       theme: "DARK",
//       orientation: "portrait",
//     });
//   } else if (hlsState === "HLS_STARTED" || hlsState === "HLS_PLAYABLE") {
//     stopHls();
//   }
// };


//   return (
//     <View
//       style={{
//         padding: 24,
//         flexDirection: "row",
//         justifyContent: "space-between",
//       }}
//     >
//       <Button
//         onPress={toggleWebcam}
//         buttonText={"Toggle Webcam"}
//         backgroundColor={"#1178F8"}
//       />
//       <Button
//         onPress={toggleMic}
//         buttonText={"Toggle Mic"}
//         backgroundColor={"#1178F8"}
//       />
//       <Button
//         onPress={_handleHLS}
//         buttonText={
//           hlsState === "HLS_STARTED" ? `Live Starting` :
//           hlsState === "HLS_STOPPING" ? `Live Stopping` :
//           hlsState === "HLS_PLAYABLE" ? `Stop Live` : `Go Live`
//         }
//         backgroundColor={"#FF5D5D"}
//       />
//     </View>
//   );
// };

// // عرض المتحدث
// const SpeakerView: React.FC = () => {
//   const { participants } = useMeeting();

//   const speakers = useMemo(() => {
//     return Array.from(participants.values()).filter(
//       (participant) => participant.mode === Constants.modes.CONFERENCE
//     );
//   }, [participants]);

//   return (
//     <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
//       <HeaderView />
//       {speakers.length > 0 ? (
//         <FlatList
//           data={speakers}
//           renderItem={({ item }) => (
//             <ParticipantView participantId={item.id} />
//           )}
//         />
//       ) : null}
//       <Controls />
//     </SafeAreaView>
//   );
// };

// // عرض الهيدر وإدارة الاجتماع
// const HeaderView: React.FC = () => {
//   const { meetingId, leave } = useMeeting();
//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         marginTop: 12,
//         justifyContent: "space-evenly",
//         alignItems: "center",
//       }}
//     >
//       <Text style={{ fontSize: 24, color: "white" }}>{meetingId}</Text>
//       <Button
//         btnStyle={{
//           borderWidth: 1,
//           borderColor: "white",
//         }}
//         onPress={() => {
//           Clipboard.setString(meetingId);
//           alert("MeetingId copied successfully");
//         }}
//         buttonText={"Copy MeetingId"}
//         backgroundColor={"transparent"}
//       />
//       <Button
//         onPress={leave}
//         buttonText={"Leave"}
//         backgroundColor={"#FF0000"}
//       />
//     </View>
//   );
// };

// // عرض المستخدمين
// const ViewerView: React.FC = () => {
//   const { hlsState, hlsUrls } = useMeeting();

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
//       {hlsState === "HLS_PLAYABLE" ? (
//         <>
//           <HeaderView />
//           <Video
//             controls={true}
//             source={{ uri: hlsUrls.playbackHlsUrl }}
//             resizeMode={"stretch"}
//             style={{ flex: 1, backgroundColor: "black" }}
//             onError={(e) => console.log("error", e)}
//           />
//         </>
//       ) : (
//         <SafeAreaView
//           style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//         >
//           <Text style={{ fontSize: 20, color: "white" }}>
//             HLS is not started yet or is stopped
//           </Text>
//         </SafeAreaView>
//       )}
//     </SafeAreaView>
//   );
// };

// // مكون رئيسي لإدارة الاجتماع بناءً على وضعية المستخدم
// const Container: React.FC = () => {
//   const { join, localParticipant } = useMeeting();

//   return (
//     <View style={{ flex: 1 }}>
//       {localParticipant?.mode === Constants.modes.CONFERENCE ? (
//         <SpeakerView />
//       ) : localParticipant?.mode === Constants.modes.VIEWER ? (
//         <ViewerView />
//       ) : (
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "black",
//           }}
//         >
//           <Text style={{ fontSize: 20, color: "white" }}>
//             Press Join button to enter studio.
//           </Text>
//           <Button
//             btnStyle={{
//               marginTop: 8,
//               paddingHorizontal: 22,
//               padding: 12,
//               borderWidth: 1,
//               borderColor: "white",
//               borderRadius: 8,
//             }}
//             buttonText={"Join"}
//             onPress={join}
//             backgroundColor={"#1178F8"}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// // زر مشترك
// interface ButtonProps {
//   onPress: () => void;
//   buttonText: string;
//   backgroundColor: string;
//   btnStyle?: object;
// }

// const Button: React.FC<ButtonProps> = ({ onPress, buttonText, backgroundColor, btnStyle }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         ...btnStyle,
//         backgroundColor: backgroundColor,
//         padding: 10,
//         borderRadius: 8,
//       }}
//     >
//       <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
//     </TouchableOpacity>
//   );
// };

// // التطبيق الرئيسي
// const LiveTeacherScreen: React.FC = () => {
//   const [meetingId, setMeetingId] = useState<string | null>(null);
//   const [mode, setMode] = useState<"CONFERENCE" | "VIEWER">("CONFERENCE");

//   const getMeetingAndToken = async (id?: string) => {
//     const meetingId = id == null ? await createMeeting({ token: authToken }) : id;
//     setMeetingId(meetingId);
//   };

//   return authToken && meetingId ? (
//     <MeetingProvider
//       config={{
//         meetingId,
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "Ahmed",
//         mode: mode,
//       }}
//       token={authToken}
//     >
//       <Container />
//     </MeetingProvider>
//   ) : (
//     <JoinScreen getMeetingAndToken={getMeetingAndToken} setMode={setMode} />
//   );
// };

// export default LiveTeacherScreen;




// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   MediaStream,
//   RTCView,
//   Constants,
//   useParticipant
// } from '@videosdk.live/react-native-sdk';
// import { createMeeting, authToken } from './api';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../lib/routeType';
// import { Ionicons } from '@expo/vector-icons';

// type CreateNewSessionNavigationProp = StackNavigationProp<
//   AuthStackParamList,
//   'LiveTeacherScreen'
// >;

// const LiveTeacherScreen: React.FC = () => {
//   const [meetingId, setMeetingId] = useState<string | null>(null);
//   const [classCode, setClassCode] = useState<string>('');
//   const [isStreaming, setIsStreaming] = useState<boolean>(false);

//   useEffect(() => {
//     const initMeeting = async () => {
//       try {
//         const id = await createMeeting();
//         setMeetingId(id);
//       } catch (error) {
//         console.error("Error initializing meeting:", error);
//       }
//     };

//     initMeeting();
//   }, []);

//   const startLiveStream = () => {
//     if (meetingId) {
//       setIsStreaming(true);
//     }
//   };

//   const stopLiveStream = () => {
//     setIsStreaming(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <TextInput
//         placeholder="Enter Class Code"
//         value={classCode}
//         onChangeText={setClassCode}
//         style={styles.input}
//       />
//       {meetingId ? (
//         <MeetingProvider
//           config={{
//             meetingId,
//             micEnabled: true,
//             webcamEnabled: true,
//             name: "Teacher",
//             mode: "CONFERENCE" as const,
//           }}
//           token={authToken}
//         >
//           <Text style={styles.meetingIdText}>Meeting ID: {meetingId}</Text>
//           <Button title={isStreaming ? "Stop Live Stream" : "Start Live Stream"} onPress={isStreaming ? stopLiveStream : startLiveStream} />
//           {isStreaming && <LiveStreamView />}
//         </MeetingProvider>
//       ) : (
//         <Text>Loading meeting...</Text>
//       )}
//     </SafeAreaView>
//   );
// };

// const LiveStreamView: React.FC = () => {
//   const { participants } = useMeeting({});

//   return (
//     <FlatList
//       data={[...participants.values()]}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => <ParticipantView participantId={item.id} />}
//     />
//   );
// };

// const ParticipantView: React.FC<{ participantId: string }> = ({ participantId }) => {
//   const { webcamStream, webcamOn } = useParticipant(participantId);

//   return webcamOn && webcamStream ? (
//     <RTCView
//       streamURL={new MediaStream([webcamStream.track]).toURL()}
//       style={styles.rtcView}
//     />
//   ) : (
//     <View style={styles.noVideoView}>
//       <Text>No Video Available</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   input: {
//     borderWidth: 1,
//     marginBottom: 16,
//     padding: 8,
//   },
//   meetingIdText: {
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   rtcView: {
//     width: '100%',
//     height: 200,
//     marginVertical: 8,
//   },
//   noVideoView: {
//     width: '100%',
//     height: 200,
//     marginVertical: 8,
//     backgroundColor: 'gray',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default LiveTeacherScreen;




// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { SafeAreaView, View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
// import {
//   MeetingProvider,
//   useMeeting,
//   useParticipant,
// } from "@videosdk.live/react-native-sdk";
// import { authToken, createMeeting, fetchHlsDownstreamUrl } from "./api";
// import { useNavigation } from "@react-navigation/native";
// import Video from 'react-native-video'; // استخدام react-native-video لمكون الفيديو

// // Component to join a meeting or create a new one
// function JoinScreen({ getMeetingAndToken }: { getMeetingAndToken: (id: string | null) => void }) {
//   const [meetingId, setMeetingId] = useState<string | null>(null);

//   const onClick = async () => {
//     await getMeetingAndToken(meetingId);
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder="Enter Meeting Id"
//         onChangeText={(text) => setMeetingId(text)}
//         style={styles.input}
//       />
//       <Button title="Join" onPress={onClick} />
//       <Text> or </Text>
//       <Button title="Create Meeting" onPress={() => getMeetingAndToken(null)} />
//     </View>
//   );
// }

// // Component to join an HLS stream
// function HLSJoinScreen({ onDownstreamUrl }: { onDownstreamUrl: (url: string) => void }) {
//   const [meetingId, setMeetingId] = useState<string | null>(null);

//   const handleOnClick = async () => {
//     if (meetingId) {
//       const downstreamUrl = await fetchHlsDownstreamUrl({ meetingId });
//       if (downstreamUrl) {
//         onDownstreamUrl(downstreamUrl);
//       }
//     }
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder="Enter Meeting Id"
//         onChangeText={(text) => setMeetingId(text)}
//         style={styles.input}
//       />
//       <Button title="Join" onPress={handleOnClick} />
//     </View>
//   );
// }

// // Component to display video streams of participants
// const VideoComponent: React.FC<{ participantId: string }> = ({ participantId }) => {
//   const { webcamStream, micStream, webcamOn, micOn } = useParticipant(participantId);

//   const videoStream = useMemo(() => {
//     if (webcamOn && webcamStream) {
//       const mediaStream = new MediaStream([webcamStream.track]);
//       return mediaStream;
//     }
//     return null;
//   }, [webcamStream, webcamOn]);

//   return (
//     <View>
//       {webcamOn && videoStream && (
//         <Video
//           source={{ uri: videoStream.toURL() }}
//           style={styles.video}
//           muted
//           repeat
//           resizeMode="cover"
//         />
//       )}
//       {micOn && (
//         <Text>Mic is On</Text> // لا يدعم React Native `audio` عنصر
//       )}
//     </View>
//   );
// };

// // Controls component for meeting management
// function Controls() {
//   const { leave, toggleMic, toggleWebcam } = useMeeting();

//   return (
//     <View>
//       <Button title="Leave" onPress={leave} />
//       <Button title="Toggle Mic" onPress={toggleMic} />
//       <Button title="Toggle Webcam" onPress={toggleWebcam} />
//     </View>
//   );
// }

// // Main container for meeting functionality
// function Container({ meetingId }: { meetingId: string }) {
//   const { participants, join, isMeetingJoined, startHls } = useMeeting({
//     onMeetingJoined: () => startHls(),
//     onHlsStarted: (downstreamUrl) => {
//       console.log("HLS Started at URL: ", downstreamUrl);
//     },
//   });

//   return (
//     <View>
//       <Text>Meeting Id: {meetingId}</Text>
//       {isMeetingJoined ? (
//         <>
//           <Controls />
//           <FlatList
//             data={[...participants.keys()]}
//             renderItem={({ item }) => <VideoComponent participantId={item} />}
//             keyExtractor={(item) => item}
//           />
//         </>
//       ) : (
//         <Button title="Join" onPress={join} />
//       )}
//     </View>
//   );
// }

// // Container to manage meetings and HLS streams
// function MeetingContainer() {
//   const [meetingId, setMeetingId] = useState<string | null>(null);

//   const getMeetingAndToken = async (id: string | null) => {
//     const newMeetingId = id === null ? await createMeeting() : id;
//     setMeetingId(newMeetingId);
//   };

//   return authToken && meetingId ? (
//     <MeetingProvider
//       config={{
//         meetingId,
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "Teacher",
//       }}
//       token={authToken}
//     >
//       <Container meetingId={meetingId} />
//     </MeetingProvider>
//   ) : (
//     <JoinScreen getMeetingAndToken={getMeetingAndToken} />
//   );
// }

// // Main Live Session Screen component
// const LiveTeacherScreen: React.FC = () => {
//   const [mode, setMode] = useState<string>("host");

//   const isHost = useMemo(() => mode === "host", [mode]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Button
//         title={isHost ? "Join as a Viewer" : "Join as a Host"}
//         onPress={() => setMode((prev) => (prev === "host" ? "viewer" : "host"))}
//       />
//       {isHost ? <MeetingContainer /> : <HLSJoinScreen onDownstreamUrl={() => {}} />}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   input: {
//     borderWidth: 1,
//     marginBottom: 16,
//     padding: 8,
//   },
//   video: {
//     width: '100%',
//     height: 200,
//     marginVertical: 8,
//   },
// });

// export default LiveTeacherScreen;









// import { MeetingProvider, useMeeting } from '@videosdk.live/react-native-sdk';
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


// // قم بتحميل مفاتيح API من متغيرات البيئة
// const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkNTQyODViZi1mZjQxLTQzZGItOTA5Mi00YmE1ZDI5YzlkZjciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyNDc4ODc5NiwiZXhwIjoxNzI1MzkzNTk2fQ.pF_Aw2GRxzgsdif_FpAbn2zdGesdaxEEkR4uwVryh1U';
// //const SECRET_KEY = process.env.SECRET_KEY || '';

// const LiveTeacherScreen: React.FC = () => {
//   const [meetingId, setMeetingId] = useState<string | null>(null);

//   const createMeeting = async () => {
//     try {
//       const response = await fetch('https://api.videosdk.live/v1/meetings', {
//         method: 'POST',
//         headers: {
//           Authorization: `${API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const { meetingId } = await response.json();
//       setMeetingId(meetingId);
//     } catch (error) {
//       console.error('Error creating meeting:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!meetingId ? (
//         <TouchableOpacity style={styles.button} onPress={createMeeting}>
//           <Text style={styles.buttonText}>Start Live Stream</Text>
//         </TouchableOpacity>
//       ) : (
//         <MeetingProvider
//           config={{
//             meetingId: meetingId,
//             autoConsume: true,
//             preferredProtocol: "UDP_ONLY",
//             name: 'Teacher',
//             micEnabled: true,
//             webcamEnabled: true,
//           }}
//           token={API_KEY as string} // تأكد من أن التوكن من النوع string
//         >
//           <MeetingView meetingId={meetingId} />
//         </MeetingProvider>
//       )}
//     </View>
//   );
// };

// const MeetingView: React.FC<{ meetingId: string }> = ({ meetingId }) => {
//   const { join, leave, toggleMic, toggleWebcam, participants } = useMeeting({
//     onMeetingJoined: () => console.log('Meeting joined'),
//     onMeetingLeft: () => console.log('Meeting left'),
//     onParticipantJoined: (participant) => console.log('Participant joined', participant),
//     onParticipantLeft: (participant) => console.log('Participant left', participant),
//     onSpeakerChanged: (activeSpeakerId) => console.log('Speaker changed', activeSpeakerId),
//   });

//   return (
//     <View style={styles.meetingContainer}>
//       <Text>Meeting ID: {meetingId}</Text>
//       <TouchableOpacity style={styles.button} onPress={join}>
//         <Text style={styles.buttonText}>Join Meeting</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={leave}>
//         <Text style={styles.buttonText}>Leave Meeting</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={() => toggleMic()}>
//         <Text style={styles.buttonText}>Toggle Mic</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.button} onPress={() => toggleWebcam()}>
//         <Text style={styles.buttonText}>Toggle Webcam</Text>
//       </TouchableOpacity>
//       <Text>Participants:</Text>
//       {Object.values(participants).map((participant: any) => (
//         <Text key={participant.id}>{participant.displayName}</Text>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   button: {
//     backgroundColor: '#6200ea',
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//   },
//   meetingContainer: {
//     flex: 1,
//     width: '100%',
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default LiveTeacherScreen;





// import React, { useEffect, useState, useRef } from 'react';
// import { View, Button, StyleSheet } from 'react-native';
// import Daily, { DailyCall, RTCView } from '@daily-co/react-native-daily-js';
// import { useSelector } from 'react-redux'; // Assuming you're using redux to manage state
// import { RootState } from '../../store/store'; // Adjust the import path based on your project structure

// const LiveTeacherScreen: React.FC = () => {
//   const callFrameRef = useRef<DailyCall | null>(null);
//   const [callStarted, setCallStarted] = useState(false);
//   const [remoteStreams, setRemoteStreams] = useState<any[]>([]); // Store remote streams

//   const classId = useSelector((state: RootState) => state.app.classId);
//   const teacherId = useSelector((state: RootState) => state.app.teacherId);

//   useEffect(() => {
//     if (classId && teacherId && !callFrameRef.current) {
//       const callFrame = Daily.createCallObject();
//       callFrameRef.current = callFrame;

//       callFrame.on('joined-meeting', () => setCallStarted(true));
      
//       callFrame.on('participant-updated', (event) => {
//         if (event.participant && event.participant.videoTrack) {
//           setRemoteStreams((prevStreams) => {
//             const existingStream = prevStreams.find(
//               (stream) => stream.id === event.participant.id
//             );

//             if (existingStream) {
//               return prevStreams.map((stream) =>
//                 stream.id === event.participant.id
//                   ? event.participant.videoTrack
//                   : stream
//               );
//             } else {
//               return [...prevStreams, event.participant.videoTrack];
//             }
//           });
//         }
//       });

//       // Handle errors and other important events
//       callFrame.on('error', (error) => {
//         console.error('Call error:', error);
//       });

//       // Start the call by joining
//       callFrame.join({ url: 'https://brigh.daily.co/learning_programming' }); // Replace with your room URL

//       // Cleanup on unmount
//       return () => {
//         callFrame.leave();
//         callFrame.destroy();
//         callFrameRef.current = null;
//       };
//     }
//   }, [classId, teacherId]);

//   const renderStreams = () => {
//     return remoteStreams.map((stream, index) => (
//       <RTCView
//         key={index}
//         streamURL={stream.toURL()} // Ensure the stream has the toURL() method
//         style={styles.video}
//         objectFit="cover"
//       />
//     ));
//   };

//   return (
//     <View style={styles.container}>
//       {!callStarted ? (
//         <Button title="Join Call" onPress={() => callFrameRef.current?.startCamera()} />
//       ) : (
//         renderStreams() // Render video streams
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default LiveTeacherScreen;














// import React, { useState, useEffect } from 'react';
// import { View, Button, StyleSheet } from 'react-native';
// import {
//   createAgoraRtcEngine,
//   IRtcEngine,
//   RtcSurfaceView,
//   VideoDenoiserMode
// } from 'react-native-agora';

// // ضع الـ App ID الخاص بك هنا
// const AGORA_APP_ID = '94c319d594ee480ab48e162c47caa2e4';
// const CHANNEL_NAME = 'Bright_Coders';

// const LiveTeacherScreen: React.FC = () => {
//   const [engine, setEngine] = useState<IRtcEngine | null>(null);
//   const [isJoined, setIsJoined] = useState<boolean>(false);
//   const [remoteUid, setRemoteUid] = useState<number | null>(null);

//   useEffect(() => {
//     // إنشاء وتثبيت Agora engine
//     const initAgora = async () => {
//       const agoraEngine = createAgoraRtcEngine();
//       agoraEngine.initialize({ appId: AGORA_APP_ID });

//       // إضافة المستمعين للأحداث
//       agoraEngine.registerEventHandler({
//         onJoinChannelSuccess: (connection, elapsed) => {
//           console.log('JoinChannelSuccess', connection, elapsed);
//           setIsJoined(true);
//         },
//         onUserJoined: (connection, uid, elapsed) => {
//           console.log('UserJoined', connection, uid, elapsed);
//           setRemoteUid(uid);
//         },
//         onUserOffline: (connection, uid, reason) => {
//           console.log('UserOffline', connection, uid, reason);
//           setRemoteUid(null);
//         },
//       });

//       await agoraEngine.enableVideo();

//       setEngine(agoraEngine);
//     };

//     initAgora();

//     return () => {
//       if (engine) {
//         engine.unregisterEventHandler();
//         engine.release();
//       }
//     };
//   }, []);

//   const startCall = async () => {
//     if (engine) {
//       await engine.startPreview();
//       await engine.joinChannel(null, CHANNEL_NAME, null, 0);
//     }
//   };

//   const endCall = async () => {
//     if (engine) {
//       await engine.leaveChannel();
//       setIsJoined(false);
//       setRemoteUid(null);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {isJoined ? (
//         <>
//           {/* عرض الفيديو المحلي */}
//           <RtcSurfaceView
//             style={styles.video}
//             canvas={{ uid: 0 }}
//             renderMode={VideoDenoiserMode.Hidden}
//           />
//           {/* عرض الفيديو عن بعد إذا كان المستخدم متصلًا */}
//           {remoteUid !== null && (
//             <RtcSurfaceView
//               style={styles.video}
//               canvas={{ uid: remoteUid }}
//               renderMode={VideoDenoiserMode.Hidden}
//             />
//           )}
//           <Button title="End Call" onPress={endCall} />
//         </>
//       ) : (
//         <Button title="Start Call" onPress={startCall} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     width: '100%',
//     height: '50%',
//   },
// });

// export default LiveTeacherScreen;




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