import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchClasses } from '../lib/CRUD'; // قم بتحديث هذا المسار حسب مكان حفظ ملف CRUD

const { width } = Dimensions.get('window');

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('Action');

  useEffect(() => {
    async function loadClasses() {
      const fetchedClasses = await fetchClasses();
      setClasses(fetchedClasses as never[]);    }
  
    loadClasses();
  }, []);

  const filteredClasses = classes.filter(c =>
    c.class_name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back-outline" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Classes</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="globe-outline" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search classes..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity style={styles.createButton}>
        <Ionicons name="add-outline" style={styles.createButtonIcon} />
        <Text style={styles.createButtonText}>Create New Class</Text>
      </TouchableOpacity>

      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortOption}>{sortOption}</Text>
          <Ionicons name="chevron-down-outline" style={styles.sortIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.classesList}>
        {filteredClasses.map(c => (
          <View key={c.id} style={styles.classCard}>
            <Text style={styles.classTitle}>{c.class_name}</Text>
            <View style={styles.classDetails}>
              <Text style={styles.classDetailText}>{c.student_count} students</Text>
              <Text style={styles.classDetailText}>{c.lesson_count} lessons</Text>
              <Text style={styles.classDetailText}>{c.completion_percentage}% completion</Text>
            </View>
            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage Class</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="grid-outline" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="book-outline" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="chatbubble-ellipses-outline" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#A557F5',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 20,
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#A557F5',
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: 15,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonIcon: {
    fontSize: 20,
    color: '#FFF',
    marginRight: 10,
  },
  createButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sortText: {
    fontSize: 16,
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sortOption: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  sortIcon: {
    fontSize: 16,
    color: '#333',
  },
  classesList: {
    paddingHorizontal: 20,
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  classDetailText: {
    fontSize: 14,
    color: '#666',
  },
  manageButton: {
    marginTop: 10,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: 28,
    color: '#A557F5',
  },
  menuItemText: {
    color: '#A557F5',
    fontSize: 14,
  },
});
