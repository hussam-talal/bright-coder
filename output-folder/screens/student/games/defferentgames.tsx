// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
// import { WebView } from 'react-native-webview';


// const GamesDiffrentScreen = () => {
//   const [selectedGame, setSelectedGame] = useState<string | null>(null);

//   const renderGameLink = ({ item }: { item: Game }) => (
//     <TouchableOpacity style={styles.linkContainer} onPress={() => setSelectedGame(item.url)}>
//       <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
//       <Text style={styles.linkText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       {selectedGame ? (
//         <WebView source={{ uri: selectedGame }} style={{ flex: 1 }} />
//       ) : (
//         <View style={styles.container}>
//           <Text style={styles.title}>Select a Game to Play</Text>
//           <FlatList
//             data={games}
//             renderItem={renderGameLink}
//             keyExtractor={item => item.id}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f8f9fa',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   linkContainer: {
//     padding: 15,
//     backgroundColor: '#6c63ff',
//     borderRadius: 10,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   gameImage: {
//     width: 50,
//     height: 50,
//     marginRight: 15,
//     borderRadius: 5,
//   },
//   linkText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default GamesDiffrentScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../../../components/Header';

interface Gamess {
  id: string;
  name: string;
  url: string;
  imageurl: string;
}

const onlineGames: Gamess[] = [
  {
    id: '1',
    name: 'Blockly Games',
    url: 'https://blockly.games/',
    imageurl: 'https://blockly.games/static/mazegames.png',
  },
  {
    id: '2',
    name: 'Lightbot',
    url: 'https://lightbot.com/flash.html',
    imageurl: 'https://lightbot.com/img/logo-lightbot.png',
  },
  // باقي الألعاب...
];

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  slug: string;
}

const GamesDiffrentScreen = () => {
  const [apiGames, setApiGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGames = async () => {
    try {
      const response = await fetch('https://api.rawg.io/api/games?key=f1fcd3146b8a4360bb9dbb6aae20a076&tags=education');
      const data = await response.json();
      const fetchedGames = data.results.map((game: any) => ({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        slug: game.slug,
      }));
      setApiGames(fetchedGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const renderOnlineGame = ({ item }: { item: Gamess }) => (
    <TouchableOpacity style={styles.linkContainer} onPress={() => setSelectedGame(item.url)}>
      <Image source={{ uri: item.imageurl }} style={styles.gameImage} />
      <Text style={styles.linkText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderApiGame = ({ item }: { item: Game }) => (
    <TouchableOpacity style={styles.linkContainer} onPress={() => setSelectedGame(`https://rawg.io/games/${item.slug}`)}>
      <Image source={{ uri: item.background_image }} style={styles.gameImage} />
      <Text style={styles.linkText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container1}>
        <Header title="Games Diffrent" />
    
    <View style={{ flex: 1 }}>
      {selectedGame ? (
        <WebView source={{ uri: selectedGame }} style={{ flex: 1 }} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Select a Game to Play</Text>
          <FlatList
            data={onlineGames}
            renderItem={renderOnlineGame}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={apiGames}
            renderItem={renderApiGame}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      )}
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
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkContainer: {
    padding: 15,
    backgroundColor: '#6c63ff',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 5,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GamesDiffrentScreen;
