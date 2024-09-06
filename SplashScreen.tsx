import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from './lib/routeType';
import { StackNavigationProp } from '@react-navigation/stack';

type AccountTypeSelectionNavigationProp = StackNavigationProp<AuthStackParamList>;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<AccountTypeSelectionNavigationProp>();

  const handleStart = () => {
    navigation.navigate('AccountTypeSelection');
  };

  return (
    <Pressable
      style={styles.iphone8Plus2}
      onPress={handleStart} // Navigate on screen press
    >
      <ImageBackground
        style={styles.icon}
        resizeMode="cover"
        source={require("./assets/logostart.png")} 
      >
        {/* Bright Coding Title */}
        {/* <Text style={styles.brightCoding}>Bright Coding</Text> */}

        <View style={styles.image11} />


        {/* Start Button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>

      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  brightCoding: {
    top: 368,
    left: 70,
    fontSize: 24, // Replaced with static font size
    letterSpacing: 0,
    lineHeight: 30,
    fontWeight: "800",
    fontFamily: "Arial", 
    color: "#FFF", 
    textAlign: "center",
    width: 254,
    height: 60,
    position: "absolute",
  },
  image11: {
    top: 151,
    left: -12,
    borderRadius: 26,
    width: 239,
    height: 154,
    position: "absolute",
  },
  image12Icon: {
    top: 182,
    left: 52,
    width: 291,
    height: 157,
    position: "absolute",
  },
  image13Icon: {
    top: 156,
    left: 104,
    borderRadius: 25,
    width: 188,
    height: 144,
    position: "absolute",
  },
  icon: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  iphone8Plus2: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  startButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: '#FFF',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  startButtonText: {
    color: '#4B0076',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
