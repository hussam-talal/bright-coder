
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Header from '../../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../lib/routeType';
import { useNavigation } from '@react-navigation/native';

type CreateGamesNavigationProp = StackNavigationProp<AuthStackParamList>;

// تعريف لواجهة اللعبة
interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  slug: string;
}

const API_KEY = 'f1fcd3146b8a4360bb9dbb6aae20a076'; // Use your API Key here

const MultiplayerGamesScreen = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<CreateGamesNavigationProp>();


  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log('Fetching multiplayer games...');
        const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&tags=multiplayer&genres=educational`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const data = await response.json();
        console.log('API response data:', data); // Response log for verification

        if (data.results && data.results.length > 0) {
          const fetchedGames = data.results.map((game: any) => ({
            id: game.id,
            name: game.name,
            background_image: game.background_image,
            rating: game.rating,
            slug: game.slug,
          }));

          setGames(fetchedGames);
        } else {
          console.warn('No games found with the given filters.');
          Alert.alert('Notice', 'No multiplayer games found for the given criteria.');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
        Alert.alert('Error', 'Failed to fetch multiplayer games. Please check your network and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handlePlayGame = (game: Game) => {
    const gameUrl = `https://rawg.io/games/${game.slug}`;
    WebBrowser.openBrowserAsync(gameUrl);
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.gameContainer}>
      <View style={styles.gameDetails}>
        <Text style={styles.gameName}>{item.name}</Text>
        <Text style={styles.gameRating}>Rating: {item.rating.toFixed(1)}</Text>
        <TouchableOpacity style={styles.playButton} onPress={() => handlePlayGame(item)}>
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.background_image }} style={styles.gameImage} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (

    <View style={styles.container1}>      
      <Header title='Multiplayer Games' />
      <View style={styles.container}>      

      {games.length > 0 ? (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.noGamesText}>No games available at the moment.</Text>
      )}
      <TouchableOpacity style={styles.createGameButton} onPress={() => navigation.navigate('CreateInteractiveGameScreen')}>
        <Text style={styles.createGameButtonText}>Create Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.joinGameButton}>
        <Text style={styles.joinGameButtonText}>Join Game</Text>
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
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  gameContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  gameDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  gameRating: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  playButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createGameButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  createGameButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  joinGameButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinGameButtonText: {
    color: '#6200ea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGamesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});

export default MultiplayerGamesScreen;
