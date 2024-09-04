import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase'; 
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../components/Header';

type Activity = {
  id: number;
  title: string;
  due_date: string; // Changed from 'date' to 'due_date'
  status: string;
  category: string;
};

export default function ActivityParentScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const { data: activitiesData, error } = await supabase
        .from('assignments') 
        .select('*')
        .order('due_date', { ascending: false }); // Changed 'date' to 'due_date'

      if (error) {
        throw error;
      }

      setActivities(activitiesData || []);
      setFilteredActivities(activitiesData || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  const filterActivitiesByCategory = (category: string) => {
    setSelectedCategory(category);

    if (category === 'All') {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter((activity) => activity.category === category);
      setFilteredActivities(filtered);
    }
  };

  const filterActivitiesByDateRange = () => {
    if (startDate && endDate) {
      const filtered = activities.filter((activity) => {
        const activityDate = new Date(activity.due_date); // Changed 'date' to 'due_date'
        return activityDate >= startDate && activityDate <= endDate;
      });
      setFilteredActivities(filtered);
    } else {
      setFilteredActivities(activities);
    }
  };

  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTitle}>{item.title}</Text>
      <Text style={styles.activityDate}>Due Date: {item.due_date}</Text> {/* Changed 'Date' to 'Due Date' */}
      <Text style={styles.activityStatus}>Status: {item.status}</Text>
      <Pressable style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container1}>      
      <Header title='Child Activity' />
    <View style={styles.container}>
      <Text style={styles.header}>Child Activities</Text>

      {/* Date Range Picker */}
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <MaterialIcons name="date-range" size={24} color="#6200ea" />
          <Text style={styles.datePickerText}>Select date range</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <>
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                setStartDate(date || startDate);
                filterActivitiesByDateRange();
              }}
            />
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                setEndDate(date || endDate);
                filterActivitiesByDateRange();
              }}
            />
          </>
        )}
      </View>

      {/* Activity Categories */}
      <View style={styles.categoriesContainer}>
        {['All', 'Games', 'Arts', 'Homework', 'Science'].map((category) => (
          <Pressable
            key={category}
            onPress={() => filterActivitiesByCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredActivities}
          renderItem={renderActivityItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.activitiesList}
        />
      )}
    </View>
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
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    color: '#6200ea',
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  selectedCategoryButton: {
    backgroundColor: '#6200ea',
  },
  categoryButtonText: {
    color: '#6200ea',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  activitiesList: {
    flexGrow: 0,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  activityStatus: {
    fontSize: 14,
    color: '#555',
  },
  detailsButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
