// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { fetchImageRecognitionGames, addImageRecognitionProgress } from '../../../lib/CRUD';
// import { supabase } from '../../../lib/supabase';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../../lib/routeType';

// type ImageRecognitionGamesNavigationProp = StackNavigationProp<AuthStackParamList, 'ImageRecognitionGames'>;

// type Props = {
//   navigation: ImageRecognitionGamesNavigationProp;
// };

// interface ImageRecognitionGame {
//   id: number;
//   game_id: number;
//   image_url: string;
//   correct_answer: string;
//   options: string[];
// }

// const ImageRecognitionGames: React.FC<Props> = ({ navigation }) => {
//   const [games, setGames] = useState<ImageRecognitionGame[]>([]);
//   const [currentGameIndex, setCurrentGameIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [score, setScore] = useState(0);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session?.user?.id) {
//         setUserId(session.user.id);

//         const { data: userProfile, error } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();

//         if (error) {
//           console.error('Error fetching user profile:', error);
//         } else if (userProfile) {
//           setUserRole(userProfile.role);
//         }
//       } else {
//         Alert.alert('Error', 'Unable to fetch user session.');
//       }
//     };

//     fetchUserData();

//     const loadGames = async () => {
//       const data = await fetchImageRecognitionGames();
//       if (data) {
//         setGames(data);
//       }
//     };
//     loadGames();
//   }, []);

//   const handleNext = async () => {
//     if (!selectedOption) {
//       Alert.alert('Error', 'Please select an option before proceeding.');
//       return;
//     }

//     const currentGame = games[currentGameIndex];

//     if (selectedOption === currentGame.correct_answer) {
//       Alert.alert('Correct!', 'You have selected the right answer.');
//       setScore(prevScore => prevScore + 1);
//     } else {
//       Alert.alert('Incorrect', 'The selected answer is not correct.');
//     }

//     if (userId) {
//       await addImageRecognitionProgress(
//         userId,
//         currentGame.game_id,
//         score + (selectedOption === currentGame.correct_answer ? 1 : 0),
//         1,
//         selectedOption === currentGame.correct_answer ? 1 : 0
//       );
//     } else {
//       Alert.alert('Error', 'User ID is not available.');
//     }

//     if (currentGameIndex < games.length - 1) {
//       setCurrentGameIndex(prevIndex => prevIndex + 1);
//       setSelectedOption(null);
//     } else {
//       Alert.alert('Game Over', `You completed the game! Your score is: ${score}/${games.length}`);
//       setCurrentGameIndex(0);
//       setSelectedOption(null);
//       setScore(0);
//     }
//   };

//   const handleAddGame = () => {
//     navigation.navigate('AdminRecognition');
//   };

//   if (games.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   const currentGame = games[currentGameIndex];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Concepts Recognition Game</Text>
//       <Image source={{ uri: currentGame.image_url }} style={styles.image} />

//       <View style={styles.optionsContainer}>
//         {currentGame.options.map(option => (
//           <TouchableOpacity
//             key={option}
//             style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
//             onPress={() => setSelectedOption(option)}
//           >
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//         <Text style={styles.nextButtonText}>Next</Text>
//       </TouchableOpacity>

//       {userRole === 'Admin' && (
//         <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
//           <Ionicons name="add" size={30} color="#FFF" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginBottom: 20,
//     borderRadius: 10,
//   },
//   optionsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   optionButton: {
//     backgroundColor: '#1e90ff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   optionText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedOption: {
//     backgroundColor: '#4caf50',
//   },
//   nextButton: {
//     backgroundColor: '#008CBA',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     backgroundColor: '#6D31ED',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
// });

// export default ImageRecognitionGames;













// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
// import { fetchImageRecognitionGames, addImageRecognitionProgress } from '../../../lib/CRUD';
// import { supabase } from '../../../lib/supabase';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../../lib/routeType';

// type ImageRecognitionGamesNavigationProp = StackNavigationProp<AuthStackParamList, 'ImageRecognitionGames'>;

// type Props = {
//   navigation: ImageRecognitionGamesNavigationProp;
// };

// interface ImageRecognitionGame {
//   id: number;
//   game_id: number;
//   image_url: string;
//   correct_answer: string;
//   options: string[];
// }

// const ImageRecognitionGames: React.FC<Props> = ({ navigation }) => {
//   const [games, setGames] = useState<ImageRecognitionGame[]>([]);
//   const [currentGameIndex, setCurrentGameIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [score, setScore] = useState(0);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true); // حالة تحميل لتتبع ما إذا كانت البيانات قد جلبت

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session?.user?.id) {
//         setUserId(session.user.id);

//         const { data: userProfile, error } = await supabase
//           .from('profiles')
//           .select('role')
//           .eq('id', session.user.id)
//           .single();

//         if (error) {
//           console.error('Error fetching user profile:', error);
//         } else if (userProfile) {
//           setUserRole(userProfile.role);
//         }
//       } else {
//         Alert.alert('Error', 'Unable to fetch user session.');
//       }
//     };

//     const loadGames = async () => {
//       const data = await fetchImageRecognitionGames();
//       if (data) {
//         setGames(data);
//       }
//       setLoading(false); // إنهاء حالة التحميل بعد جلب البيانات
//     };

//     fetchUserData();
//     loadGames();
//   }, []);

//   const handleNext = async () => {
//     if (!selectedOption) {
//       Alert.alert('Error', 'Please select an option before proceeding.');
//       return;
//     }

//     const currentGame = games[currentGameIndex];

//     if (selectedOption === currentGame.correct_answer) {
//       Alert.alert('Correct!', 'You have selected the right answer.');
//       setScore(prevScore => prevScore + 1);
//     } else {
//       Alert.alert('Incorrect', 'The selected answer is not correct.');
//     }

//     if (userId) {
//       await addImageRecognitionProgress(
//         userId,
//         currentGame.game_id,
//         score + (selectedOption === currentGame.correct_answer ? 1 : 0),
//         1,
//         selectedOption === currentGame.correct_answer ? 1 : 0
//       );
//     } else {
//       Alert.alert('Error', 'User ID is not available.');
//     }

//     if (currentGameIndex < games.length - 1) {
//       setCurrentGameIndex(prevIndex => prevIndex + 1);
//       setSelectedOption(null);
//     } else {
//       Alert.alert('Game Over', `You completed the game! Your score is: ${score}/${games.length}`);
//       setCurrentGameIndex(0);
//       setSelectedOption(null);
//       setScore(0);
//     }
//   };

//   const handleAddGame = () => {
//     navigation.navigate('AdminRecognition');
//   };

//   // تحقق من حالة التحميل وعرض مؤشر التحميل
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   if (games.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>No games available.</Text>
//       </View>
//     );
//   }

//   const currentGame = games[currentGameIndex];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Concepts Recognition Game</Text>
//       <Image source={{ uri: currentGame.image_url }} style={styles.image} />

//       <View style={styles.optionsContainer}>
//         {currentGame.options.map(option => (
//           <TouchableOpacity
//             key={option}
//             style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
//             onPress={() => setSelectedOption(option)}
//           >
//             <Text style={styles.optionText}>{option}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//         <Text style={styles.nextButtonText}>Next</Text>
//       </TouchableOpacity>

//       {userRole === 'Admin' && (
//         <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
//           <Ionicons name="add" size={30} color="#FFF" />
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginBottom: 20,
//     borderRadius: 10,
//   },
//   optionsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   optionButton: {
//     backgroundColor: '#1e90ff',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   optionText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedOption: {
//     backgroundColor: '#4caf50',
//   },
//   nextButton: {
//     backgroundColor: '#008CBA',
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   addButton: {
//     position: 'absolute',
//     bottom: 30,
//     right: 30,
//     backgroundColor: '#6D31ED',
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//   },
// });

// export default ImageRecognitionGames;










import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { fetchImageRecognitionGames, addImageRecognitionProgress } from '../../../lib/CRUD';
import { supabase } from '../../../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../lib/routeType';
import Header from '../../../components/Header';

type ImageRecognitionGamesNavigationProp = StackNavigationProp<AuthStackParamList, 'ImageRecognitionGames'>;

type Props = {
  navigation: ImageRecognitionGamesNavigationProp;
};

interface ImageRecognitionGame {
  id: number;
  game_id: number;
  image_url: string;
  correct_answer: string;
  options: string[];
}

const ImageRecognitionGames: React.FC<Props> = ({ navigation }) => {
  const [games, setGames] = useState<ImageRecognitionGame[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        Alert.alert('Error', 'Unable to fetch user session.');
        return;
      }

      if (session?.user?.id) {
        setUserId(session.user.id);
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          Alert.alert('Error', 'Unable to fetch user profile.');
        } else if (userProfile) {
          setUserRole(userProfile.role);
        }
      } else {
        Alert.alert('Error', 'No user session found.');
      }
    };

    fetchUserData();

    const loadGames = async () => {
      const data = await fetchImageRecognitionGames();
      if (data) {
        setGames(data);
      } else {
        console.warn('No games data available.');
      }
    };

    loadGames();
  }, []);

  const handleNext = async () => {
    if (!selectedOption) {
      Alert.alert('Error', 'Please select an option before proceeding.');
      return;
    }

    const currentGame = games[currentGameIndex];

    if (selectedOption === currentGame.correct_answer) {
      Alert.alert('Correct!', 'You have selected the right answer.');
      setScore(prevScore => prevScore + 1);
    } else {
      Alert.alert('Incorrect', 'The selected answer is not correct.');
    }

    if (userId) {
      await addImageRecognitionProgress(
        userId,
        currentGame.game_id,
        score + (selectedOption === currentGame.correct_answer ? 1 : 0),
        1,
        selectedOption === currentGame.correct_answer ? 1 : 0
      );
    } else {
      Alert.alert('Error', 'User ID is not available.');
    }

    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
    } else {
      Alert.alert('Game Over', `You completed the game! Your score is: ${score}/${games.length}`);
      setCurrentGameIndex(0);
      setSelectedOption(null);
      setScore(0);
    }
  };

  const handleAddGame = () => {
    navigation.navigate('AdminRecognition');
  };

  // تعديل العرض هنا لإظهار زر "الإضافة" بغض النظر عن حالة الألعاب
  return (
    <View style={styles.container1}>
        <Header title="Image Recognition" />
    <View style={styles.container}>
      {games.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Concepts Recognition Game</Text>
          <Image source={{ uri: games[currentGameIndex].image_url }} style={styles.image} />
          
          <View style={styles.optionsContainer}>
            {games[currentGameIndex].options.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, selectedOption === option && styles.selectedOption]}
                onPress={() => setSelectedOption(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {userRole === 'Admin' && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
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
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#4caf50',
  },
  nextButton: {
    backgroundColor: '#008CBA',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6D31ED',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default ImageRecognitionGames;
