import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Animated, PanResponder, Alert } from 'react-native';
import { Audio } from 'expo-av'; // لإضافة الأصوات
import Header from '../../../components/Header'; // تأكد من استيراد الهيدر الخاص بك

const CreateInteractiveGameScreen = () => {
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [position, setPosition] = useState(new Animated.ValueXY()); // موضع السحب والإفلات للشخصيات

  // تحميل الصوتيات
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../../assets/click.wav'));
    await sound.playAsync();
  };

  // إعداد السحب والإفلات
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      // إذا أطلق الطفل الشخصية في مكان معين، يمكنك استخدامه لمزيد من التفاعل
      Alert.alert('Drop!', 'You dropped the character!');
    },
  });

  const handleCreateGame = () => {
    if (!selectedCharacter || !selectedBackground || !selectedLevel) {
      Alert.alert('Error', 'Please choose all game elements.');
      return;
    }

    Alert.alert('Success', 'Your game is created!', [
      { text: 'OK', onPress: () => console.log('Game Created') }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Create Your Interactive Game" />

      <Text style={styles.label}>Choose Your Character</Text>
      <ScrollView horizontal contentContainerStyle={styles.optionsContainer}>
        <TouchableOpacity onPress={() => { setSelectedCharacter('https://link-to-character1-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-character1-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedCharacter('https://link-to-character2-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-character2-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedCharacter('https://link-to-character3-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-character3-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.label}>Drag Your Character</Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          position.getLayout(),
          styles.draggableCharacter,
        ]}
      >
        {selectedCharacter ? (
          <Image source={{ uri: selectedCharacter }} style={styles.optionImage} />
        ) : (
          <Text>Select a character first</Text>
        )}
      </Animated.View>

      <Text style={styles.label}>Choose Your Background</Text>
      <ScrollView horizontal contentContainerStyle={styles.optionsContainer}>
        <TouchableOpacity onPress={() => { setSelectedBackground('https://link-to-background1-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-background1-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedBackground('https://link-to-background2-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-background2-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedBackground('https://link-to-background3-image.png'); playSound(); }}>
          <Image source={{ uri: 'https://link-to-background3-image.png' }} style={styles.optionImage} />
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.label}>Choose Your Difficulty Level</Text>
      <View style={styles.levelsContainer}>
        <TouchableOpacity style={selectedLevel === 'easy' ? styles.selectedLevel : styles.level} onPress={() => { setSelectedLevel('easy'); playSound(); }}>
          <Text style={styles.levelText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={selectedLevel === 'medium' ? styles.selectedLevel : styles.level} onPress={() => { setSelectedLevel('medium'); playSound(); }}>
          <Text style={styles.levelText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={selectedLevel === 'hard' ? styles.selectedLevel : styles.level} onPress={() => { setSelectedLevel('hard'); playSound(); }}>
          <Text style={styles.levelText}>Hard</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
        <Text style={styles.createButtonText}>Create My Game!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFEB3B', // لون مبهج مناسب للأطفال
    padding: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  draggableCharacter: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  level: {
    backgroundColor: '#ccc',
    padding: 20,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateInteractiveGameScreen;
