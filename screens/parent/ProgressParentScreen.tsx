import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { supabase } from '../../lib/supabase'; 
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../lib/routeType';
import { getAuth } from 'firebase/auth';

type ProgressParentNavigationProp = StackNavigationProp<AuthStackParamList>;


type ChildData = {
  id: string;
  full_name: string;
  age: number;
  grade: string;
  parent_id: string;
};

export default function ProgressParentScreen() {
  const navigation = useNavigation<ProgressParentNavigationProp>();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchChildren();
    }
  }, [isFocused]);

  const fetchChildren = async () => {
    try {
      setLoading(true);

      // الحصول على المستخدم الحالي من Firebase Auth
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('Parent session ended.');
      }

      const parentId = currentUser.uid;

      if (!parentId) {
        throw new Error('Parent is not logged in');
      }

      const { data: childrenData, error: childrenError } = await supabase
        .from('children') 
        .select('*')
        .eq('parent_id', parentId);

      if (childrenError) {
        throw new Error('Error fetching children data');
      }

      setChildren(childrenData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load children data.');
    } finally {
      setLoading(false);
    }
  };

  const renderChildItem = ({ item }: { item: ChildData }) => (
    <View style={styles.childCard}>
      <Text style={styles.childName}>{item.full_name}</Text>
      <Text style={styles.childDetails}>Age: {item.age} | Grade: {item.grade}</Text>
      <Pressable 
        style={styles.progressButton} 
        onPress={() => navigation.navigate('ChildProgressScreen', { childId: item.id })}
      >
        <Text style={styles.progressButtonText}>View Progress</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Child Progress</Text>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={children}
          renderItem={renderChildItem}
          keyExtractor={(item) => item.id}
          style={styles.childrenList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  childrenList: {
    flexGrow: 0,
  },
  childCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  childDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  progressButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  progressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
