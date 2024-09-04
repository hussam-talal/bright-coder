// components/HeaderStudent.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const HeaderStudent = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Bright Coders</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="globe-outline" size={24} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
});

export default HeaderStudent;
