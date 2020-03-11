/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

import Login from 'components/Login';
import {AuthProvider} from 'contexts/auth';

import * as Font from 'expo-font';

import('./ReactotronConfig').then(() => {});

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Inter: require('assets/fonts/Inter-Regular.otf'),
      'Trebuchet MS': require('assets/fonts/trebuc.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <>
      {!fontLoaded ? (
        <Text>Loading...</Text>
      ) : (
        <AuthProvider>
          <Login />
        </AuthProvider>
      )}
    </>
  );
};

export default App;
