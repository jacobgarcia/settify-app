import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import InputScreen from 'components/InputScreen';
import Playlists from 'components/Playlists';

const Social = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Search" component={InputScreen} />
      <Stack.Screen name="Playlists" component={Playlists} />
    </Stack.Navigator>
  );
};

export default Social;
