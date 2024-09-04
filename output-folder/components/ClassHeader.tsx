// ClassHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ClassHeaderProps = {
  classData: {
    class_name: string;
    code: string;
  } | null;
  studentCount: number | null;
  lessonCount: number | null;
  loading: boolean;
};

const ClassHeader: React.FC<ClassHeaderProps> = ({ classData, studentCount, lessonCount, loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.infoText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {classData ? (
        <>
          <Text style={styles.headerText}>{classData.class_name}</Text>
          <View style={styles.classInfo}>
            <Text style={styles.infoText}>Students: {studentCount !== null ? studentCount : 'Loading...'}</Text>
            <Text style={styles.infoText}>Lessons: {lessonCount !== null ? lessonCount : 'Loading...'}</Text>
            <Text style={styles.infoText}>Your class code: {classData.code}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.infoText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#8A2BE2',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  classInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClassHeader;
