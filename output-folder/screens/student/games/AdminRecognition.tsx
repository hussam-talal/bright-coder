import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addImageRecognitionGame } from '../../../lib/CRUD'; // تأكد من استيراد الدالة التي تقوم بإضافة بيانات إلى الجدول

const AddImageRecognitionGameScreen = () => {
  const [gameId, setGameId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');

  const handleAddGame = async () => {
    // تحقق من صحة الإدخالات
    if (!gameId || !imageUrl || !correctAnswer || !option1 || !option2 || !option3 || !option4) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const options = [option1, option2, option3, option4];

    try {
      const data = await addImageRecognitionGame(Number(gameId), imageUrl, correctAnswer, options);
      if (data) {
        Alert.alert('Success', 'Game data added successfully.');
        setGameId('');
        setImageUrl('');
        setCorrectAnswer('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
      }
    } catch (error) {
      console.error('Error adding game data:', error);
      Alert.alert('Error', 'There was an error adding the game data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Image Recognition Game</Text>

      <TextInput
        style={styles.input}
        placeholder="Game ID"
        value={gameId}
        onChangeText={setGameId}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TextInput
        style={styles.input}
        placeholder="Correct Answer"
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
      />

      <TextInput
        style={styles.input}
        placeholder="Option 1"
        value={option1}
        onChangeText={setOption1}
      />

      <TextInput
        style={styles.input}
        placeholder="Option 2"
        value={option2}
        onChangeText={setOption2}
      />

      <TextInput
        style={styles.input}
        placeholder="Option 3"
        value={option3}
        onChangeText={setOption3}
      />

      <TextInput
        style={styles.input}
        placeholder="Option 4"
        value={option4}
        onChangeText={setOption4}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
        <Text style={styles.addButtonText}>Add Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddImageRecognitionGameScreen;








// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { addImageRecognitionGame } from '../../../lib/CRUD'; // تأكد من استيراد الدالة التي تقوم بإضافة بيانات إلى الجدول

// const AddImageRecognitionGameScreen = () => {
//   const [gameId, setGameId] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [correctAnswer, setCorrectAnswer] = useState('');
//   const [option1, setOption1] = useState('');
//   const [option2, setOption2] = useState('');
//   const [option3, setOption3] = useState('');
//   const [option4, setOption4] = useState('');

//   const handleAddGame = async () => {
//     // تحقق من صحة الإدخالات
//     if (!gameId || !imageUrl || !correctAnswer || !option1 || !option2 || !option3 || !option4) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const options = [option1, option2, option3, option4];

//     try {
//       // استدعاء الدالة لإضافة البيانات إلى الجدول
//       const data = await addImageRecognitionGame(Number(gameId), imageUrl, correctAnswer, options);
//       if (data) {
//         Alert.alert('Success', 'Game data added successfully.');
//         // إعادة تعيين الحقول
//         setGameId('');
//         setImageUrl('');
//         setCorrectAnswer('');
//         setOption1('');
//         setOption2('');
//         setOption3('');
//         setOption4('');
//       } else {
//         Alert.alert('Error', 'No data returned after adding the game.');
//       }
//     } catch (error) {
//       console.error('Error adding game data:', error);
//       Alert.alert('Error', 'There was an error adding the game data. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Image Recognition Game</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Game ID"
//         value={gameId}
//         onChangeText={setGameId}
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Image URL"
//         value={imageUrl}
//         onChangeText={setImageUrl}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Correct Answer"
//         value={correctAnswer}
//         onChangeText={setCorrectAnswer}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Option 1"
//         value={option1}
//         onChangeText={setOption1}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Option 2"
//         value={option2}
//         onChangeText={setOption2}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Option 3"
//         value={option3}
//         onChangeText={setOption3}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Option 4"
//         value={option4}
//         onChangeText={setOption4}
//       />

//       <TouchableOpacity style={styles.addButton} onPress={handleAddGame}>
//         <Text style={styles.addButtonText}>Add Game</Text>
//       </TouchableOpacity>
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
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 10,
//     fontSize: 16,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
//   addButton: {
//     backgroundColor: '#6200ea',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   addButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default AddImageRecognitionGameScreen;
