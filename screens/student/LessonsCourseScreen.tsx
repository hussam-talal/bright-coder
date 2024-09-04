import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchLessonsByCourseId, fetchProgressByCourseId } from '../../lib/CRUD'; 
import { AuthStackParamList } from '../../lib/routeType';
import Header from '../../components/Header';

const Tab = createMaterialTopTabNavigator();

interface Lesson {
  id: number;
  title: string;
  description: string;
  imageurl: string;
}

interface Progress {
  lessonId: number;
  progressPercentage: number;
}

const LessonsTab: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const fetchedLessons = await fetchLessonsByCourseId(courseId);
      setLessons(fetchedLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Lesson }) => (
    <View style={styles.lessonCard}>
      <Image source={{ uri: item.imageurl }} style={styles.lessonImage} />
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text style={styles.lessonDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={lessons.filter(lesson => lesson.title.toLowerCase().includes(searchText.toLowerCase()))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={loadLessons}
      />
    </View>
  );
};

const ProgressTab: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const fetchedProgress = await fetchProgressByCourseId(courseId);
      setProgressData(fetchedProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container1}>
        <Header title="Courses" />
    <View style={styles.container}>
      {/* Add UI elements to display progress here */}
      {/* Example: List of lessons with progress percentage */}
      <FlatList
        data={progressData}
        keyExtractor={(item) => item.lessonId.toString()}
        renderItem={({ item }) => (
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>Lesson ID: {item.lessonId}</Text>
            <Text style={styles.progressText}>Progress: {item.progressPercentage}%</Text>
          </View>
        )}
        refreshing={loading}
        onRefresh={loadProgress}
      />
    </View>
    </View>
  );
};

const LessonsCourseScreen: React.FC = () => {
  const route = useRoute<RouteProp<AuthStackParamList, 'LessonsCourseScreen'>>();
  const { courseId } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen name="Lessons">
        {() => <LessonsTab courseId={courseId} />}
      </Tab.Screen>
      <Tab.Screen name="In Progress">
        {() => <ProgressTab courseId={courseId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container1:{
    flex: 1,
    backgroundColor: '#800080'
  },
  container: {
    flex: 1,
    backgroundColor: '#E91E63',
    padding: 20,
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  lessonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lessonDescription: {
    fontSize: 14,
    color: 'gray',
  },
  progressCard: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default LessonsCourseScreen;
