import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { supabase } from '../../lib/supabase';
import { useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ControlParent: { childId: string; parentId: string };
};

type ControlParentScreenRouteProp = RouteProp<RootStackParamList, 'ControlParent'>;

type ParentalControlData = {
  id: number;
  screen_time_limit: number;
  restrict_multiplayer: boolean;
  restrict_live_sessions: boolean;
  parent_id: string;
  student_id: string;
};

export default function ControlParentScreen() {
  const route = useRoute<ControlParentScreenRouteProp>();
  const { childId, parentId } = route.params;

  const [controlData, setControlData] = useState<ParentalControlData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [screenTimeLimit, setScreenTimeLimit] = useState<number>(2); // Default 2 hours per day
  const [restrictContent, setRestrictContent] = useState({
    violentGames: false,
    inappropriateContent: false,
    socialMedia: false,
  });

  useEffect(() => {
    fetchControlData();
  }, []);

  const fetchControlData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('parental_controls')
        .select('*')
        .eq('student_id', childId)
        .eq('parent_id', parentId)
        .single();

      if (error) {
        throw error;
      }

      setControlData(data);
      setScreenTimeLimit(data.screen_time_limit || 2);
      setRestrictContent({
        violentGames: data.restrict_multiplayer,
        inappropriateContent: data.restrict_live_sessions,
        socialMedia: false, // Adding new control
      });

    } catch (error) {
      console.error('Error fetching parental controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateParentalControls = async () => {
    try {
      setLoading(true);

      const updates = {
        screen_time_limit: screenTimeLimit,
        restrict_multiplayer: restrictContent.violentGames,
        restrict_live_sessions: restrictContent.inappropriateContent,
      };

      const { error } = await supabase
        .from('parental_controls')
        .update(updates)
        .eq('student_id', childId)
        .eq('parent_id', parentId);

      if (error) {
        throw error;
      }

      alert('Parental controls updated successfully');
    } catch (error) {
      console.error('Error updating parental controls:', error);
      alert('Failed to update parental controls');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSwitchChange = (key: keyof typeof restrictContent) => {
    setRestrictContent(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>App Usage Controls</Text>

      <Button
        title="Child Management"
        onPress={() => console.log('Navigate to Child Management Screen')}
        color="#8E24AA"
      />

      <View style={styles.controlSection}>
        <Text style={styles.subHeader}>Screen Time Limits</Text>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayText}>{day}</Text>
            <Switch
              value={selectedDays.includes(day)}
              onValueChange={() => toggleDay(day)}
            />
          </View>
        ))}

        <Text style={styles.sliderLabel}>Hours per day</Text>
        <Slider
  minimumValue={0}
  maximumValue={24}
  step={1}
  value={screenTimeLimit}
  onValueChange={(value: number) => setScreenTimeLimit(value)} 
  style={styles.slider}
/>

        <Text style={styles.sliderValue}>{screenTimeLimit} hours</Text>
      </View>

      <View style={styles.controlSection}>
        <Text style={styles.subHeader}>Content Restrictions</Text>
        {Object.keys(restrictContent).map((key) => (
          <View key={key} style={styles.restrictionRow}>
            <Text style={styles.restrictionText}>
              {key === 'violentGames' ? 'Violent Games' : key === 'inappropriateContent' ? 'Age Inappropriate Content' : 'Social Media'}
            </Text>
            <Switch
              value={restrictContent[key as keyof typeof restrictContent]}
              onValueChange={() => handleSwitchChange(key as keyof typeof restrictContent)}
            />
          </View>
        ))}
      </View>

      <Button
        title="Save Changes"
        onPress={updateParentalControls}
        color="#8E24AA"
        disabled={loading}
      />
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
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controlSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
  },
  sliderLabel: {
    fontSize: 16,
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  restrictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  restrictionText: {
    fontSize: 16,
  },
});
