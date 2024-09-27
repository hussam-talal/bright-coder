import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
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

      // Fetch achievement data
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('title, earned_at')
        .eq('user_id', childId);

      if (achievementsError) {
        throw achievementsError;
      }

      if (achievementsData && achievementsData.length > 0) {
        setAchievements(achievementsData);
      } else {
        Alert.alert('Notice', 'No achievements found for this user.');
      }

      // Fetch assignments data
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('title, progress')
        .eq('student_id', childId);

      if (assignmentsError) {
        throw assignmentsError;
      }

      if (assignmentsData && assignmentsData.length > 0) {
        setAssignments(assignmentsData);
      } else {
        Alert.alert('Notice', 'No assignments found for this user.');
      }

      // Fetch challenge data from challenge_participants
      const { data: challengesData, error: challengesError } = await supabase
        .from('challenge_participants')
        .select('challenge_id, score')
        .eq('user_id', childId);

      if (challengesError) {
        throw challengesError;
      }

      if (challengesData.length > 0) {
        const challengeDetails = await Promise.all(
          challengesData.map(async (challenge) => {
            const { data, error } = await supabase
              .from('challenges')
              .select('title')
              .eq('id', challenge.challenge_id)
              .single();

            if (error || !data) {
              return { title: 'Unknown Challenge', score: challenge.score };
            }

            return { title: data.title, score: challenge.score };
          })
        );

        setChallenges(challengeDetails);
      } else {
        Alert.alert('Notice', 'No challenges found for this user.');
      }

    } catch (error) {
      console.error('Error fetching child progress data:', error);
      Alert.alert('Error', 'Failed to fetch child progress data.');
    } finally {
      setLoading(false);
    }
  };

  const formatLineChartData = () => {
    const labels = achievements.map((data) => data.earned_at);
    const scores = achievements.map(() => 1); // Incrementing for each achievement

    return {
      labels,
      datasets: [
        {
          data: scores,
          strokeWidth: 2,
        },
      ],
    };
  };

  const formatBarChartData = () => ({
    labels: challenges.map((challenge) => challenge.title),
    datasets: [
      {
        data: challenges.map((challenge) => challenge.score),
      },
    ],
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Progress Overview</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          {/* Line Chart for Achievements */}
          <Text style={styles.chartTitle}>Achievements Over Time</Text>
          {achievements.length > 0 ? (
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
          ) : (
            <Text style={styles.noDataText}>No achievements data available.</Text>
          )}

          {/* Bar Chart for Challenges */}
          <Text style={styles.chartTitle}>Challenges Scores</Text>
          {challenges.length > 0 ? (
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
          ) : (
            <Text style={styles.noDataText}>No challenge data available.</Text>
          )}
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
  noDataText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
  },
});
