import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header'; 
import { AuthStackParamList } from '../../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type SingleGameNavigationProp = StackNavigationProp<AuthStackParamList>;
interface Game {
    id: string;
    name: string;
    genre: string;
    imageUrl: string;
  }
  

const educationalGames = [
  {
    id: '1',
    name: 'Blockly Games',
    genre: 'Puzzle, Educational',
    imageUrl: 'https://blockly.games/static/mazegames.png',
    description: 'Learn programming with Blockly Games.',
  },
  {
    id: '2',
    name: 'Lightbot',
    genre: 'Puzzle, Educational',
    imageUrl: 'https://lightbot.com/img/logo-lightbot.png',
    description: 'Guide the robot to light up all the tiles using programming logic.',
  },
  {
    id: '3',
    name: 'Scratch',
    genre: 'Creative, Educational',
    imageUrl: 'https://scratch.mit.edu/images/logo_large.png',
    description: 'Create interactive stories, games, and animations.',
  },
  {
    id: '4',
    name: 'CodeMonkey',
    genre: 'Adventure, Educational',
    imageUrl: 'https://www.codemonkey.com/wp-content/uploads/2019/07/cropped-logo-02-270x270.png',
    description: 'Help the monkey catch bananas by solving coding challenges.',
  },
  {
    id: '5',
    name: 'Khan Academy Programming',
    genre: 'Educational',
    imageUrl: 'https://cdn.kastatic.org/googleusercontent/D4yTeWz1b7o4GZd5hHb5h2qZr7u4xC5MkzUJtsjHkT82M1KXLwQfSFKlBbFMGlRQNN2TVZ8nTwzLNDLxCQKiKT1D',
    description: 'Learn the basics of programming with Khan Academy.',
  },
  {
    id: '6',
    name: 'CodinGame',
    description: 'Learn coding by playing games.',
    genre: 'Strategy, Educational',
    imageUrl: 'https://static.codingame.com/assets/default-184b0f0e42f2e7a0c60cddc2f4145e6e.png',
  },

  {
    id: '7',
    name: 'Code.org',
    description: 'Learn the basics of computer science.',
    genre: 'Educational, Tutorial',
    imageUrl: 'https://studio.code.org/assets/logo.png',
  },
  {
    id: '8',
    name: 'Swift Playgrounds',
    description: 'Learn Swift in a fun way.',
    genre: 'Educational, Programming',
    imageUrl: 'https://www.apple.com/v/swift/playgrounds/e/images/meta/swift-playgrounds__b09wy38b2dk6_og.png',
  },
  {
    id: '9',
    name: 'CheckIO',
    description: 'Practice coding through engaging games.',
    genre: 'Puzzle, Educational',
    imageUrl: 'https://checkio.s3.amazonaws.com/static/img/checkio_logo.png',
  },
  {
    id: '10',
    name: 'Run Marco!',
    description: 'Adventure-based coding game for kids.',
    genre: 'Adventure, Educational',
    imageUrl: 'https://www.allcancode.com/img/logo-runmarco.png',
  },
  {
    id: '11',
    name: 'Kodable',
    description: 'Learn to code with fun adventures.',
    genre: 'Adventure, Puzzle',
    imageUrl: 'https://www.kodable.com/assets/kodable_logo.svg',
  },
  {
    id: '12',
    name: 'RoboZZle',
    description: 'Solve puzzles using programming logic.',
    genre: 'Puzzle, Logic',
    imageUrl: 'http://www.robozzle.com/robozzlelogo.gif',
  },
];

export default function SinglePlayer() {
  const navigation = useNavigation<SingleGameNavigationProp>();
  const [searchText, setSearchText] = useState('');

  // تصفية الألعاب بناءً على نص البحث
  const filteredGames = educationalGames.filter(game =>
    game.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.gameCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.gameThumbnail} />
      <Text style={styles.gameTitle}>{item.name}</Text>
      <Text style={styles.gameGenre}>{item.genre}</Text>
      <TouchableOpacity>
        <Text style={styles.startGameText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container1}>      
      <Header title='Single Player' />
  
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Text Code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('GamesDiffrentScreen')}>
          <Text style={styles.tabText}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('OfflineGamesScreen')}>
          <Text style={styles.tabText}>Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Edit Code</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredGames}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gamesContainer}
      />
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#6200ea',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  gamesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  gameThumbnail: {
    backgroundColor: '#e0e0e0',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  gameGenre: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  startGameText: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});










// import React from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Header from '../../../components/Header'; 
// import { AuthStackParamList } from '../../../lib/routeType';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation } from '@react-navigation/native';

// type SingleGameNavigationProp = StackNavigationProp<AuthStackParamList>;

// export default function SinglePlayer() {
//   const navigation= useNavigation<SingleGameNavigationProp>();
//   return (
//     <View style={styles.container}>
//       <Header title='Single Player' />
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={24} color="#888" />
//         <TextInput style={styles.searchInput} placeholder="Search ..." placeholderTextColor="#888" />
//       </View>

//       <View style={styles.tabContainer}>
//         <TouchableOpacity style={styles.activeTab}>
//           <Text style={styles.activeTabText}>text code</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab} onPress={()=> navigation.navigate('GamesDiffrentScreen')}>
//           <Text style={styles.tabText}>game</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab} onPress={()=> navigation.navigate('OfflineGamesScreen')} >
//           <Text style={styles.tabText}>offline</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tab}>
//           <Text style={styles.tabText}>Edit Code</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.gamesContainer}>
//         <View style={styles.gameCard}>
//           <View style={styles.gameThumbnail}></View>
//           <Text style={styles.gameTitle}>Python</Text>
//           <Text style={styles.gameGenre}>Action, Adventure</Text>
//           <TouchableOpacity>
//             <Text style={styles.startGameText}>Start Game</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.gameCard}>
//           <View style={styles.gameThumbnail}></View>
//           <Text style={styles.gameTitle}>JavaScript</Text>
//           <Text style={styles.gameGenre}>Adventure, Puzzle</Text>
//           <TouchableOpacity>
//             <Text style={styles.startGameText}>Start Game</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.gameCard}>
//           <View style={styles.gameThumbnail}></View>
//           <Text style={styles.gameTitle}>Java</Text>
//           <Text style={styles.gameGenre}>Action, Shooter</Text>
//           <TouchableOpacity>
//             <Text style={styles.startGameText}>Start Game</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.gameCard}>
//           <View style={styles.gameThumbnail}></View>
//           <Text style={styles.gameTitle}>Python</Text>
//           <Text style={styles.gameGenre}>RPG, Adventure</Text>
//           <TouchableOpacity>
//             <Text style={styles.startGameText}>Start Game</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginVertical: 15,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingLeft: 10,
//     color: '#000',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   tab: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   activeTab: {
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderBottomWidth: 2,
//     borderBottomColor: '#6200ea',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#888',
//   },
//   activeTabText: {
//     fontSize: 16,
//     color: '#6200ea',
//     fontWeight: 'bold',
//   },
//   gamesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   gameCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     width: '48%',
//     marginBottom: 20,
//   },
//   gameThumbnail: {
//     backgroundColor: '#e0e0e0',
//     height: 100,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   gameTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#000',
//   },
//   gameGenre: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 10,
//   },
//   startGameText: {
//     fontSize: 16,
//     color: '#6200ea',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
