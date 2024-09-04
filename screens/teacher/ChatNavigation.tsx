// ChatNavigation.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './ChatScreen'; 

const Stack = createStackNavigator();

const ChatNavigation: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Chat">
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
    </Stack.Navigator>
  );
};

export default ChatNavigation;
