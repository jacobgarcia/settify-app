import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PlaylistsList from 'views/PlaylistsList';
import Details from 'views/Details';

import theme from 'styles/theme.style.js';

const Social = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="PlaylistsList">
      <Stack.Screen
        name="Playlists"
        component={PlaylistsList}
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
        name="Details"
        component={Details}
        options={{
          title: 'Details',
          headerStyle: {
            backgroundColor: theme.COLOR_PRIMARY,
          },
          headerTintColor: theme.COLOR_LIGHT_GREY_100,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default Social;
