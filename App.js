/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Login from 'components/Login';
import {AuthProvider} from 'contexts/auth';

import * as Font from 'expo-font';

import('./ReactotronConfig').then(() => {
  console.log('Reactotron Configured');
  const Reactotron = require('reactotron-react-native').default;
  Reactotron.log('Hello world');
});

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      Inter: require('assets/fonts/Inter-Regular.otf'),
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

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
