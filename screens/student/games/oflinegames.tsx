import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { supabase } from '../../../lib/supabase'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Header from '../../../components/Header';
import { getAuth } from 'firebase/auth';

interface Game {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  isDownloaded: boolean;
}

const onlineGames: Game[] = [
  {
    id: '1',
    name: 'Blockly Games',
    url: 'https://blockly.games/',
    imageUrl: 'https://blockly.games/static/mazegames.png',
    isDownloaded: false,
  },
  {
    id: '2',
    name: 'Lightbot',
    url: 'https://lightbot.com/flash.html',
    imageUrl: 'https://lightbot.com/img/logo-lightbot.png',
    isDownloaded: false,
  },
  {
    id: '3',
    name: 'Scratch',
    url: 'https://scratch.mit.edu/',
    imageUrl: 'https://scratch.mit.edu/images/logo_large.png',
    isDownloaded: false,
  },
  {
    id: '4',
    name: 'CodeMonkey',
    url: 'https://www.codemonkey.com/',
    imageUrl: 'https://www.codemonkey.com/wp-content/uploads/2019/07/cropped-logo-02-270x270.png',
    isDownloaded: false,
  },
  {
    id: '5',
    name: 'Khan Academy Programming',
    url: 'https://www.khanacademy.org/computing/computer-programming',
    imageUrl: 'https://cdn.kastatic.org/googleusercontent/D4yTeWz1b7o4GZd5hHb5h2qZr7u4xC5MkzUJtsjHkT82M1KXLwQfSFKlBbFMGlRQNN2TVZ8nTwzLNDLxCQKiKT1D',
    isDownloaded: false,
  },
  {
    id: '6',
    name: 'CodinGame',
    url: 'https://www.codingame.com/start',
    imageUrl: 'https://static.codingame.com/assets/default-184b0f0e42f2e7a0c60cddc2f4145e6e.png',
    isDownloaded: false,
  },
  {
    id: '7',
    name: 'Tynker',
    url: 'https://www.tynker.com/',
    imageUrl: 'https://www.tynker.com/static/logo/logo-tynker.png',
    isDownloaded: false,
  },
  {
    id: '8',
    name: 'Code.org',
    url: 'https://studio.code.org/',
    imageUrl: 'https://studio.code.org/assets/logo.png',
    isDownloaded: false,
  },
  {
    id: '9',
    name: 'Swift Playgrounds',
    url: 'https://www.apple.com/swift/playgrounds/',
    imageUrl: 'https://www.apple.com/v/swift/playgrounds/e/images/meta/swift-playgrounds__b09wy38b2dk6_og.png',
    isDownloaded: false,
  },
  {
    id: '10',
    name: 'CheckIO',
    url: 'https://checkio.org/',
    imageUrl: 'https://checkio.s3.amazonaws.com/static/img/checkio_logo.png',
    isDownloaded: false,
  },
];

const OfflineGamesScreen: React.FC = () => {
  const [games, setGames] = useState<Game[]>(onlineGames);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null); // حالة لتخزين user_id

  useEffect(() => {
    // الحصول على user_id من Supabase
    const fetchUserId = () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        setUserId(user.uid);  // استخدم معرف Firebase
      } else {
        console.error('No user logged in');
      }
    };

    fetchUserId();

    // Load downloaded games status from the database
    const fetchDownloadedGames = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('offline_content')
        .select('content_id, file_path');

      if (error) {
        console.error('Error fetching downloaded games:', error);
      } else {
        // Update the games list to reflect the downloaded status
        const updatedGames = games.map((game) => {
          const downloadedGame = data.find((g: any) => g.content_id === parseInt(game.id));
          return {
            ...game,
            isDownloaded: !!downloadedGame,
          };
        });
        setGames(updatedGames);
      }
      setLoading(false);
    };

    fetchDownloadedGames();
  }, []);

  const handleDownloadGame = async (game: Game) => {
    if (downloading || !userId) return; 

    setDownloading(true);
    try {
      const fileUri = `${FileSystem.documentDirectory}${game.name}.zip`; // Adjust the file extension as needed
      const { uri } = await FileSystem.downloadAsync(game.url, fileUri);

      // Insert the game in the database
      const { data, error } = await supabase
        .from('offline_content')
        .insert([
          {
            user_id: userId, // استخدام user_id الفعلي
            content_type: 'game',
            content_id: parseInt(game.id),
            synced: true,
            last_accessed: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Error saving game to the database:', error);
      } else {
        Alert.alert('Download Complete', 'The game has been downloaded successfully.');
        setGames((prevGames) =>
          prevGames.map((g) => (g.id === game.id ? { ...g, isDownloaded: true } : g))
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download the game.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePlayGame = (game: Game) => {
    if (game.isDownloaded) {
      // Add your logic to play the game locally
      // For example, using the WebView to open local HTML or JS files
      Sharing.shareAsync(`${FileSystem.documentDirectory}${game.name}.zip`); // Adjust according to the file path saved in the database
    } else {
      Alert.alert('Error', 'Game is not downloaded yet.');
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.gameContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
      <View style={styles.gameDetails}>
        <Text style={styles.gameName}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.button, item.isDownloaded ? styles.playButton : styles.downloadButton]}
          onPress={() => (item.isDownloaded ? handlePlayGame(item) : handleDownloadGame(item))}
        >
          <Text style={styles.buttonText}>{item.isDownloaded ? 'Play' : 'Download'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container1}>      
      <Header title='Offline Games' />
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading games...</Text>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
        />
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
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
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
  gameImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  gameDetails: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4caf50',
  },
  downloadButton: {
    backgroundColor: '#6200ea',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OfflineGamesScreen;









// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import * as WebBrowser from 'expo-web-browser';

// interface Game {
//   id: string;
//   name: string;
//   description: string;
//   imageUrl: string;
//   downloadUrl: string;
//   localPath?: string;
// }

// const games: Game[] = [
//   {
//     id: '1',
//     name: 'Example Game 1',
//     description: 'An exciting adventure game.',
//     imageUrl: 'https://example.com/game1.png',
//     downloadUrl: 'https://apkpure.com/polysphere-art-puzzle-game/com.playgendary.polyspherecoolgame',
//   },
//   {
//     id: '2',
//     name: 'Example Game 2',
//     description: 'A challenging puzzle game.',
//     imageUrl: 'https://example.com/game2.png',
//     downloadUrl: 'https://example.com/game2.apk',
//   },
//   // يمكنك إضافة المزيد من الألعاب هنا
// ];

// const handlePlayGame = (game: Game) => {
//   if (game.localPath) {
//     // إذا كان للعبة مسار محلي (تم تنزيلها)، افتحها من المسار المحلي
//     WebBrowser.openBrowserAsync(game.localPath);
//   } else {
//     // إذا لم تكن اللعبة محملة، افتحها من رابط الويب
//     WebBrowser.openBrowserAsync(game.downloadUrl);
//   }
// };

// const OfflineGamesScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [gamesList, setGamesList] = useState<Game[]>(games);

//   const handleDownloadGame = async (game: Game) => {
//     const downloadResumable = FileSystem.createDownloadResumable(
//       game.downloadUrl,
//       FileSystem.documentDirectory + `${game.name}.apk`
//     );

//     try {
//       const downloadResult = await downloadResumable.downloadAsync();

//       if (downloadResult && downloadResult.uri) {
//         const { uri } = downloadResult;
//         Alert.alert('Download complete!', `The game has been downloaded to ${uri}`);

//         // تحديث مسار اللعبة المحلي
//         const updatedGames = gamesList.map(g =>
//           g.id === game.id ? { ...g, localPath: uri } : g
//         );
//         setGamesList(updatedGames);
//       } else {
//         throw new Error('Download failed or URI is missing.');
//       }
//     } catch (error) {
//       console.error('Download error:', error);
//       Alert.alert('Download failed', 'There was an error downloading the game.');
//     }
//   };

//   const renderGame = ({ item }: { item: Game }) => (
//     <View style={styles.gameContainer}>
//       <Image source={{ uri: item.imageUrl }} style={styles.gameImage} />
//       <View style={styles.gameDetails}>
//         <Text style={styles.gameName}>{item.name}</Text>
//         <Text style={styles.gameDescription}>{item.description}</Text>
//         {item.localPath ? (
//           <TouchableOpacity style={styles.playButton} onPress={() => handlePlayGame(item)}>
//             <Text style={styles.playButtonText}>Play</Text>
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownloadGame(item)}>
//             <Text style={styles.downloadButtonText}>Download</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search games..."
//         placeholderTextColor="#888"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       <FlatList
//         data={gamesList.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()))}
//         renderItem={renderGame}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.gameList}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     paddingHorizontal: 20,
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 20,
//     fontSize: 16,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   gameList: {
//     paddingBottom: 20,
//   },
//   gameContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   gameImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   gameDetails: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   gameName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   gameDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   downloadButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   downloadButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   playButton: {
//     backgroundColor: '#008CBA',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   playButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default OfflineGamesScreen;
