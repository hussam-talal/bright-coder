import React, { useState } from 'react';
import { View, Linking, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';

// مكون الصفحة للألعاب التعليمية
export default function TextGames({ navigation }) {
  const [searchText, setSearchText] = useState('');

  const games = [
    {
      title: "Play Velocity Raptor",
      url: "https://www.testtubegames.com/velocityraptor.html",
    },
    {
      title: "Play Agent Higgs",
      url: "https://www.testtubegames.com/higgsflash.html",
    },
    {
      title: "Play Kerbal Space Program",
      url: "https://kerbalspaceprogram.com",
    },
    {
      title: "Play Bond Breaker",
      url: "https://testtubegames.com/bondbreaker.html",
    },
   
   
  ];

  // تصفية الألعاب بناءً على نص البحث
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container1}>      
    <Header title='Text Games' />

    <ScrollView style={styles.container}>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('SinglePlayer')}>
          <Text style={styles.tabText}>Text Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('GamesDiffrentScreen')}>
          <Text style={styles.tabText}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('OfflineGamesScreen')}>
          <Text style={styles.tabText}>Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Edit Code</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Educational Games for Kids</Text>
      {filteredGames.map((game, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => Linking.openURL(game.url)}
        >
          <Text style={styles.buttonText}>{game.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </View>
  );
}

// تنسيقات الصفحة
const styles = StyleSheet.create({
  container1: {
    flex: 1,

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
  },
  activeTabText: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});
