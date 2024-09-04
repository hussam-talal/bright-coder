// export const authToken ='d54285bf-ff41-43db-9092-4ba5d29c9df7'; // token should be in String format

// // API call to create meeting
// // API call to create meeting
// export const createMeeting = async ({ token }: { token: string }) => {
//   const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
//     method: "POST",
//     headers: {
//       authorization: `${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({}),
//   });

//   const { roomId } = await res.json();
//   console.log("roomId", roomId);
//   return roomId;
// };



// api.ts

// import express, { Request, Response } from 'express';
// import axios from 'axios';
// import { createClient } from '@supabase/supabase-js';

// const app = express();
// const port = process.env.PORT || 3000;

// // إعداد Supabase
// const supabaseUrl = 'https://ccrbhrzmazrwktqixcoh.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcmJocnptYXpyd2t0cWl4Y29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM3NTg1MTQsImV4cCI6MjAzOTMzNDUxNH0.x39i6FtI2Ft2nHOXuc7E6At1fpKtEQDIYhXLKvLbJj4';
// const supabase = createClient(supabaseUrl, supabaseKey);

// // إعداد Video SDK API
// const VIDEO_SDK_API_ENDPOINT = 'https://api.videosdk.live/v2/rooms';
// const VIDEO_SDK_API_TOKEN = 'd54285bf-ff41-43db-9092-4ba5d29c9df7';

// // Middleware to parse JSON
// app.use(express.json());
// interface VideoSdkResponse {
//   roomId: string;
// }

// // Route لإنشاء اجتماع جديد
// app.post('/create-meeting', async (req: Request, res: Response) => {
//   try {
//     const response = await axios.post<VideoSdkResponse>(
//       VIDEO_SDK_API_ENDPOINT,
//       {},
//       {
//         headers: { Authorization: VIDEO_SDK_API_TOKEN },
//       }
//     );

//     const meetingId = response.data.roomId; // الآن TypeScript يعرف أن response.data يحتوي على roomId
//     res.json({ meetingId });
//   } catch (error) {
//     console.error('Error creating meeting:', error);
//     res.status(500).json({ error: 'Error creating meeting' });
//   }
// });

// // بدء الخادم
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });








// api.ts


// const VIDEO_SDK_API_ENDPOINT = 'https://api.videosdk.live/v2/rooms';
// const VIDEO_SDK_API_TOKEN = 'd54285bf-ff41-43db-9092-4ba5d29c9df7';

// import axios from 'axios';

// // تعريف نوع البيانات المتوقع من استجابة API
// interface VideoSDKResponse {
//   roomId: string;
// }

// // Function to create a new meeting
// export const createMeeting = async (p0: { token: string; }): Promise<string> => {
//   try {
//     const response = await axios.post<VideoSDKResponse>(
//       VIDEO_SDK_API_ENDPOINT,
//       {},
//       {
//         headers: { Authorization: VIDEO_SDK_API_TOKEN },
//       }
//     );

//     const meetingId = response.data.roomId;
//     return meetingId;
//   } catch (error) {
//     console.error('Error creating meeting:', error);
//     throw new Error('Failed to create meeting');
//   }
// };

// // تأكد من تصدير أي وظائف أخرى تحتاجها بنفس الطريقة


// // تصدير متغيرات أخرى إن وجدت
// export const authToken = VIDEO_SDK_API_TOKEN;








// export const authToken = "d54285bf-ff41-43db-9092-4ba5d29c9df7";

// // تعريف نوع الاستجابة لإنشاء اجتماع
// interface CreateMeetingResponse {
//   meetingId: string;
// }

// // تعريف نوع البيانات لإحضار رابط البث الهبوطي
// interface FetchHlsDownstreamUrlResponse {
//   data: {
//     downstreamUrl: string;
//   }[];
// }

// // API call to create meeting
// export const createMeeting = async (): Promise<string> => {
//   const res = await fetch(`https://api.videosdk.live/v1/meetings`, {
//     method: "POST",
//     headers: {
//       authorization: `${authToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ region: "sg001" }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to create meeting");
//   }

//   const { meetingId }: CreateMeetingResponse = await res.json();
//   return meetingId;
// };

// // API call to fetch latest downstream URL for a meeting session
// export const fetchHlsDownstreamUrl = async ({ meetingId }: { meetingId: string }): Promise<string | undefined> => {
//   const res = await fetch(`https://api.videosdk.live/v2/hls/?roomId=${meetingId}`, {
//     method: "GET",
//     headers: {
//       authorization: `${authToken}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch HLS downstream URL");
//   }

//   const json: FetchHlsDownstreamUrlResponse = await res.json();

//   const downstreamUrl = json?.data[0]?.downstreamUrl;

//   return downstreamUrl;
// };





// // تعريف نوع للمعلمات الخاصة بدالة createMeeting
interface CreateMeetingParams {
    token: string;
  }
  
//   // تعريف متغير نوع string
//   export const token: string = "d54285bf-ff41-43db-9092-4ba5d29c9df7";
  
//   // دالة API لإنشاء الاجتماع
//   export const createMeeting = async ({ token }: CreateMeetingParams): Promise<string> => {
//     const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
//       method: "POST",
//       headers: {
//         authorization: `${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({}),
//     });
  
//     // تحديد نوع الرد على أنه كائن يحتوي على roomId من نوع string
//     const { roomId } = await res.json() as { roomId: string };
    
//     return roomId;
//   };
  


export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkNTQyODViZi1mZjQxLTQzZGItOTA5Mi00YmE1ZDI5YzlkZjciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyNDc4ODc5NiwiZXhwIjoxNzI1MzkzNTk2fQ.pF_Aw2GRxzgsdif_FpAbn2zdGesdaxEEkR4uwVryh1U"; // you will this token from app.videosdk.live

// API call to create meeting
export const createMeeting =  async ({ token }: CreateMeetingParams): Promise<string> => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  console.log("room id", roomId);
  return roomId;
};