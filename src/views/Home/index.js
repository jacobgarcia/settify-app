import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import Playlists from 'views/Playlists';
import Profile from 'views/Profile';
import Social from 'views/Social';

import theme from 'styles/theme.style.js';

const Main = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Playlists') {
            iconName = 'ios-musical-notes';
          } else if (route.name === 'Profile') {
            iconName = 'ios-person';
          } else if (route.name === 'Social') {
            iconName = 'ios-people';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.COLOR_PRIMARY,
        inactiveTintColor: 'gray',
        visible: false,
      }}>
      <Tab.Screen name="Playlists" component={Playlists} />
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Main;
