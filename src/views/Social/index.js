import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import InputScreen from 'components/InputScreen';
import Playlists from 'components/Playlists';
import NotFound from 'views/NotFound';

import theme from 'styles/theme.style.js';

const Social = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen
        name="Search"
        component={InputScreen}
        options={{
          headerStyle: {
            backgroundColor: theme.COLOR_PRIMARY,
          },
          headerTintColor: theme.COLOR_LIGHT_GREY_100,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Playlists"
        component={Playlists}
        options={{
          title: 'Choose a Playlist',
          headerStyle: {
            backgroundColor: theme.COLOR_PRIMARY,
          },
          headerTintColor: theme.COLOR_LIGHT_GREY_100,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFound}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};

export default Social;
