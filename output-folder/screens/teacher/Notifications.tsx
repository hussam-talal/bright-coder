// import * as Notifications from 'expo-notifications';

// // بعد جلب الرسائل الجديدة
// const loadMessages = async () => {
//   if (selectedConversation) {
//     setLoadingMessages(true);
//     try {
//       const fetchedMessages = await fetchMessages(selectedConversation.id);
//       setMessages(fetchedMessages);

//       // إرسال إشعار إذا كانت هناك رسالة جديدة
//       if (fetchedMessages.length > messages.length) {
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: "New Message",
//             body: "You have received a new message.",
//             data: { conversationId: selectedConversation.id },
//           },
//           trigger: null,
//         });
//       }

//     } catch (error) {
//       console.error('Failed to load messages:', error);
//     } finally {
//       setLoadingMessages(false);
//     }
//   }
// };
