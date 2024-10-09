import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    Image, 
    Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header'; 
import { AuthStackParamList } from '../../../lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Define navigation prop type
type SingleGameNavigationProp = StackNavigationProp<AuthStackParamList>;

// Define the Game interface
interface Game {
    id: string;
    name: string;
    genre: string;
    imageUrl: string;
    url: string;
    description: string;
}

// List of educational games
const educationalGames: Game[] = [
    {
        id: '1',
        name: 'Blockly Games',
        genre: 'Puzzle, Educational',
        imageUrl: 'https://blockly.games/static/mazegames.png',
        url: 'https://blockly.games/',
        description: 'Learn programming with Blockly Games.',
    },
    {
        id: '2',
        name: 'Lightbot',
        genre: 'Puzzle, Educational',
        imageUrl: 'https://lightbot.com/img/logo-lightbot.png',
        url: 'https://lightbot.com/',
        description: 'Guide the robot to light up all the tiles using programming logic.',
    },
    {
        id: '3',
        name: 'Scratch',
        genre: 'Creative, Educational',
        imageUrl: 'https://scratch.mit.edu/images/logo_large.png',
        url: 'https://scratch.mit.edu/',
        description: 'Create interactive stories, games, and animations.',
    },
    {
        id: '4',
        name: 'CodeMonkey',
        genre: 'Adventure, Educational',
        imageUrl: 'https://www.codemonkey.com/wp-content/uploads/2019/07/cropped-logo-02-270x270.png',
        url: 'https://www.codemonkey.com/',
        description: 'Help the monkey catch bananas by solving coding challenges.',
    },
    {
        id: '5',
        name: 'Khan Academy Programming',
        genre: 'Educational',
        imageUrl: 'https://cdn.kastatic.org/googleusercontent/D4yTeWz1b7o4GZd5hHb5h2qZr7u4xC5MkzUJtsjHkT82M1KXLwQfSFKlBbFMGlRQNN2TVZ8nTwzLNDLxCQKiKT1D',
        url: 'https://www.khanacademy.org/computing/computer-programming',
        description: 'Learn the basics of programming with Khan Academy.',
    },
    {
        id: '6',
        name: 'CodinGame',
        genre: 'Strategy, Educational',
        imageUrl: 'https://static.codingame.com/assets/default-184b0f0e42f2e7a0c60cddc2f4145e6e.png',
        url: 'https://www.codingame.com/',
        description: 'Learn coding by playing games.',
    },
    {
        id: '7',
        name: 'Code.org',
        genre: 'Educational, Tutorial',
        imageUrl: 'https://studio.code.org/assets/logo.png',
        url: 'https://code.org/',
        description: 'Learn the basics of computer science.',
    },
    {
        id: '8',
        name: 'Swift Playgrounds',
        genre: 'Educational, Programming',
        imageUrl: 'https://www.apple.com/v/swift/playgrounds/e/images/meta/swift-playgrounds__b09wy38b2dk6_og.png',
        url: 'https://www.apple.com/swift/playgrounds/',
        description: 'Learn Swift in a fun way.',
    },
    {
        id: '9',
        name: 'CheckIO',
        genre: 'Puzzle, Educational',
        imageUrl: 'https://checkio.s3.amazonaws.com/static/img/checkio_logo.png',
        url: 'https://checkio.org/',
        description: 'Practice coding through engaging games.',
    },
    {
        id: '10',
        name: 'Run Marco!',
        genre: 'Adventure, Educational',
        imageUrl: 'https://www.allcancode.com/img/logo-runmarco.png',
        url: 'https://runmarco.com/',
        description: 'Adventure-based coding game for kids.',
    },
    {
        id: '11',
        name: 'Kodable',
        genre: 'Adventure, Puzzle',
        imageUrl: 'https://www.kodable.com/assets/kodable_logo.svg',
        url: 'https://www.kodable.com/',
        description: 'Learn to code with fun adventures.',
    },
    {
        id: '12',
        name: 'RoboZZle',
        genre: 'Puzzle, Logic',
        imageUrl: 'http://www.robozzle.com/robozzlelogo.gif',
        url: 'http://robozzle.com/',
        description: 'Solve puzzles using programming logic.',
    },
];

// GameCard Component
const GameCard: React.FC<{ game: Game; onStart: (url: string) => void }> = ({ game, onStart }) => (
    <View style={styles.gameCard}>
        <Image source={{ uri: game.imageUrl }} style={styles.gameThumbnail} />
        <View style={styles.gameInfoContainer}>
            <Text style={styles.gameTitle}>{game.name}</Text>
            <Text style={styles.gameGenre}>{game.genre}</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => onStart(game.url)}>
                <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// SearchBar Component
const SearchBar: React.FC<{ value: string; onChange: (text: string) => void }> = ({ value, onChange }) => (
    <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#888" />
        <TextInput 
            style={styles.searchInput} 
            placeholder="Search for a game..." 
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChange}
        />
    </View>
);

// TabBar Component
const TabBar: React.FC<{ activeTab: string; onTabPress: (tab: string) => void }> = ({ activeTab, onTabPress }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'TextCode' && styles.activeTab]} 
            onPress={() => onTabPress('TextCode')}
        >
            <Text style={[styles.tabText, activeTab === 'TextCode' && styles.activeTabText]}>Text Code</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'Game' && styles.activeTab]} 
            onPress={() => onTabPress('Game')}
        >
            <Text style={[styles.tabText, activeTab === 'Game' && styles.activeTabText]}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'Offline' && styles.activeTab]} 
            onPress={() => onTabPress('Offline')}
        >
            <Text style={[styles.tabText, activeTab === 'Offline' && styles.activeTabText]}>Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'EditCode' && styles.activeTab]} 
            onPress={() => onTabPress('EditCode')}
        >
            <Text style={[styles.tabText, activeTab === 'EditCode' && styles.activeTabText]}>Edit Code</Text>
        </TouchableOpacity>
    </View>
);

// Main Component
export default function SinglePlayer() {
    const navigation = useNavigation<SingleGameNavigationProp>();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('TextCode');

    // Filter games based on search text
    const filteredGames = educationalGames.filter(game =>
        game.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleStartGame = (url: string) => {
        Linking.openURL(url);
    };

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        // Navigate based on the selected tab
        switch(tab) {
            case 'Game':
                navigation.navigate('GamesDiffrentScreen');
                break;
            case 'Offline':
                navigation.navigate('OfflineGamesScreen');
                break;
            case 'EditCode':
                navigation.navigate('TextGames');
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.container1}>      
            <Header title='Single Player' />
            <View style={styles.container}>
                <SearchBar value={searchText} onChange={setSearchText} />
                <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
                <FlatList
                    data={filteredGames}
                    renderItem={({ item }) => <GameCard game={item} onStart={handleStartGame} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.gamesContainer}
                />
            </View>
        </View>
    );
}

// Stylesheet
const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    gameCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    gameThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    gameInfoContainer: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    gameGenre: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    startButton: {
        marginTop: 10,
        backgroundColor: '#6200ea',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    startButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 15,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        color: '#333',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#6200ea',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    activeTabText: {
        color: '#6200ea',
        fontWeight: '600',
    },
    gamesContainer: {
        paddingBottom: 20,
    },
});
