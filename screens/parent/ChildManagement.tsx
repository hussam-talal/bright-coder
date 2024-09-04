import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../../components/Header';

type ManageNavigationProp = StackNavigationProp<AuthStackParamList>;


type ChildData = {
  id: number;
  full_name: string;
  age: number;
  grade: string;
  parent_id: string;
};

const ChildManagement = () => {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<ManageNavigationProp>();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchChildren();
    }
  }, [isFocused]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
  
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
      if (sessionError || !sessionData?.session) {
        throw new Error('Unable to fetch user session.');
      }
  
      const userId = sessionData.session.user.id;
  
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', userId);
  
      if (error) throw error;
  
      if (data) setChildren(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleEdit = (childId: number) => {
    navigation.navigate('EditChild', { childId });
  };

  const handleUsageControls = (childId: number) => {
    navigation.navigate('ControlParentScreen', { childId });
  };

  const handleDelete = async (childId: number) => {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;
      Alert.alert('Success', 'Child deleted successfully.');
      fetchChildren(); // Refresh the list
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddChild = () => {
    navigation.navigate('AddChild');
  };

  return (
    <View style={styles.container1}>      
      <Header title='Child Management' />
    <View style={styles.container}>
      <Text style={styles.title}>Child Management</Text>
      <ScrollView>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          children.map((child) => (
            <View key={child.id} style={styles.childCard}>
              <Text style={styles.childInfo}>{child.full_name}</Text>
              <Text style={styles.childInfo}>Age: {child.age} | Grade: {child.grade}</Text>
              <View style={styles.buttonGroup}>
                <Button title="Edit" onPress={() => handleEdit(child.id)} color="#4CAF50" />
                <Button title="Usage Controls" onPress={() => handleUsageControls(child.id)} color="#2196F3" />
                <Button title="Delete" onPress={() => handleDelete(child.id)} color="#F44336" />
                <TouchableOpacity onPress={() => Alert.alert('Message', 'Messaging functionality not implemented yet')}>
                  <Text style={styles.messageIcon}>📩</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddChild}>
        <Text style={styles.addButtonText}>+ Add Child</Text>
      </TouchableOpacity>
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  childCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  childInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageIcon: {
    fontSize: 20,
    marginTop: 10,
    color: '#FFC107',
  },
  addButton: {
    backgroundColor: '#673AB7',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default ChildManagement;
