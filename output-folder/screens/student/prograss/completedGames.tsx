import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ProgressBarAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchImageRecognitionProgress } from '../../../lib/CRUD'; 
import Header from '../../../components/Header';

interface GameProgress {
  game_id: number;
  game_name: string;
  score: number;
}

const CompletedGamesScreen = () => {
  const [games, setGames] = useState<GameProgress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data: GameProgress[] = (await fetchImageRecognitionProgress()) || [];
        setGames(data);
      } catch (error) {
        console.error('Error fetching games progress:', error);
      }
    };
  
    loadGames();
  }, []);
  
  const renderGame = ({ item }: { item: GameProgress }) => (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>{item.game_name}</Text>
      <Text style={styles.gameCompletion}>Completion: {item.score}%</Text>
      <ProgressBarAndroid 
        styleAttr="Horizontal" 
        color="#f08cfc" 
        indeterminate={false} 
        progress={item.score / 100} 
      />
      <TouchableOpacity
        style={styles.gameButton}
        //onPress={() => navigation.navigate('PlayGame', { gameId: item.game_id })}
      >
        <Text style={styles.gameButtonText}>Replay</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredGames = games.filter(game =>
    game.game_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container1}>      
      <Header title='Completed Games' />
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search ..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredGames}
        renderItem={renderGame}
        keyExtractor={item => item.game_id.toString()}
        contentContainerStyle={styles.gameList}
      />
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
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  gameList: {
    paddingBottom: 20,
  },
  gameContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gameCompletion: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  gameButton: {
    backgroundColor: '#d084fc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  gameButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CompletedGamesScreen;
