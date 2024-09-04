// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
// import { supabase } from '../../lib/supabase'; // Assuming you have a supabase client instance

// export default function StudentHome() {
//   const [studentData, setStudentData] = useState<any>(null); // Replace `any` with the actual type of student data
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         // Fetch the logged-in user's ID
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();

//         if (!user) {
//           console.log('User is not logged in');
//           return;
//         }

//         const { data: studentProfile, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', user.id)
//           .single();

//         if (error) {
//           throw error;
//         }

//         setStudentData(studentProfile);
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, []);

//   if (loading) {
//     return <Text>Loading...</Text>;
//   }

//   if (!studentData) {
//     return <Text>No student data found</Text>;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Bright Coders</Text>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Current Progress</Text>
//         <View style={styles.progressBar}>
//           {/* Progress Bar logic */}
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
//         {/* Map through the challenges and display them */}
//         {/* {studentData.upcomingChallenges.map((challenge: any, index: number) => (
//           <View key={index} style={styles.challenge}>
//             <Text style={styles.challengeTitle}>{challenge.title}</Text>
//             <Text style={styles.challengeSubtitle}>{`Challenge: ${challenge.subtitle}`}</Text>
//             <Text style={styles.challengeDate}>{`Due: ${challenge.dueDate}`}</Text>
//           </View>
//         ))} */}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Learning Progress</Text>
//         <View style={styles.progressBar}>
//           {/* Learning Progress Bar logic */}
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Achievement Badges</Text>
//         <View style={styles.badges}>
//           {/* {studentData.badges.map((badge: any, index: number) => (
//             <Image key={index} source={{ uri: badge.image }} style={styles.badgeImage} />
//           ))} */}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   progressBar: {
//     height: 10,
//     backgroundColor: '#ddd',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   challenge: {
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   challengeTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   challengeSubtitle: {
//     fontSize: 14,
//     color: '#888',
//   },
//   challengeDate: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   badges: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   badgeImage: {
//     width: 50,
//     height: 50,
//     margin: 5,
//   },
// });





import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, Image } from 'react-native';
import { fetchCourseProgress, fetchChallengess, fetchBadges } from '../../lib/CRUD';  // تأكد من استيراد دوال الجلب بشكل صحيح
import { Ionicons } from '@expo/vector-icons'; 
import Header from '../../components/Header'; 
import HeaderStudent from '../../components/HeaderStudent';

interface CourseProgress {
  id: number;
  user_id: string;  // نوع UUID
  course_id: number;
  current_level: number;
  progress_percentage: number;
  completed: boolean;
  created_at: string;  // توقيت زمني
  updated_at: string;  // توقيت زمني
}
interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  challenge_type: string;
  created_by: string;  // نوع UUID
  created_at?: string;  // قد تحتاج إلى إضافة هذا الحقل إذا كان متاحًا في الجدول
  updated_at?: string;  // قد تحتاج إلى إضافة هذا الحقل إذا كان متاحًا في الجدول
  due_date?: string;  // أو Date إذا كنت تستخدم النوع timestamp

}

export default function StudentHome() {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  // const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const progressData = await fetchCourseProgress();
        setCourseProgress(progressData);

        const challengeData = await fetchChallengess();
        setChallenges(challengeData);

        // const badgeData = await fetchBadges();
        // setBadges(badgeData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load data. Please try again.');
      }
    }

    fetchData();
  }, []);

  // حساب التقدم الإجمالي
  const totalProgress = courseProgress.reduce((sum, course) => sum + course.progress_percentage, 0) / (courseProgress.length || 1);

  return (
    <View style={styles.container1}>
        <Header title="Home" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${totalProgress}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Challenges</Text>
          {challenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
              <Text style={styles.challengeDueDate}>Due: {challenge.due_date ?? 'No due date'}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${totalProgress}%` }]} />
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesContainer}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View> */}
      </ScrollView>
      </View>
  );
}
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#800080',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 10,
  },
  progressBar: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#6200ea',
  },
  challengeCard: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    flex: 2,
  },
  challengeDueDate: {
    fontSize: 12,
    color: '#888',
  },
  badgesContainer: {
    marginTop: 10,
  },
  badgeCard: {
    alignItems: 'center',
    marginRight: 15,
  },
  badgeName: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6200ea',
  },
});