import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType';


type ChildProgressScreenRouteProp = RouteProp<AuthStackParamList, 'ChildProgressScreen'>;


type AchievementData = {
  title: string;
  earned_at: string;
};

type AssignmentProgressData = {
  title: string;
  progress: number;
};

type ChallengeData = {
  title: string;
  score: number;
};

export default function ChildProgressScreen() {
  const route = useRoute<ChildProgressScreenRouteProp>();
  const { childId } = route.params;
  
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [assignments, setAssignments] = useState<AssignmentProgressData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchChildData();
  }, []);

  const fetchChildData = async () => {
    try {
      setLoading(true);

      // جلب بيانات الإنجازات
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('title, earned_at')
        .eq('user_id', childId);

      if (achievementsError) {
        throw achievementsError;
      }

      setAchievements(achievementsData || []);

      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('title, progress')
        .eq('class_id', childId);

      if (assignmentsError) {
        throw assignmentsError;
      }

      setAssignments(assignmentsData || []);

      const { data: challengesData, error: challengesError } = await supabase
        .from('challenge_participants')
        .select('challenge_id, score')
        .eq('user_id', childId);

      if (challengesError) {
        throw challengesError;
      }

      if (challengesData) {
        const challengeDetails = await Promise.all(
          challengesData.map(async (challenge) => {
            const { data, error } = await supabase
            .from('challenges')
            .select('title, score')
            .eq('user_id', childId)
            .single();
          
          if (error || !data) {
            return { title: '', score: 0 }; 
          }
          
          return { title: data.title, score: challenge.score };
          
          })
        );

        setChallenges(challengeDetails);
      }

    } catch (error) {
      console.error('Error fetching child progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLineChartData = () => {
    const labels = achievements.map((data) => data.earned_at);
    const scores = achievements.map(() => 1); 

    return {
      labels,
      datasets: [
        {
          data: scores,
          strokeWidth: 2, // optional
        },
      ],
    };
  };

//   const formatBarChartData = () => {
//     const labels = challenges.map((data) => data.title);
//     const levels = challenges.map((data) => data.score);

//     return {
//       labels,
//       datasets: [
//         {
//           data: levels,
//         },
//       ],
//     };
//   };

  const formatBarChartData = () => ({
    labels: challenges.map(challenge => challenge.title),
    datasets: [
      {
        data: challenges.map(challenge => challenge.score)
      }
    ]
  });

  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Progress Overview</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {/* رسم بياني خطي للإنجازات */}
          <Text style={styles.chartTitle}>Achievements Over Time</Text>
          <LineChart
            data={formatLineChartData()}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chartStyle}
          />

          {/* رسم بياني عمودي للتحديات */}
          <Text style={styles.chartTitle}>Challenges Scores</Text>
          <BarChart
            data={formatBarChartData()}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#43a047',
              backgroundGradientTo: '#66bb6a',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chartStyle}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
