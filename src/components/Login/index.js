import React from 'react';
import {StyleSheet, View, Image, ProgressViewIOS, Linking} from 'react-native';

import Logo from 'assets/image.png';
import {Title, Subtitle} from './styled';
import Button from 'components/Button';

export default () => {
  const handleLogin = () => {
    Linking.openURL(
      'https://accounts.spotify.com/authorize?client_id=8be10436cdeb41deab45fc7502265679&redirect_uri=http://localhost:3000&scope=user-read-private%20user-read-email%20playlist-modify-public&response_type=token&state=123',
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Title>Settify®</Title>
        <Subtitle>
          Set theory applied to Spotify playlists.{'\n'}Easy as it sounds.
        </Subtitle>
      </View>
      <View style={styles.middleContainer}>
        <Image source={Logo} style={styles.image} />
      </View>
      <ProgressViewIOS number={1} />
      <View style={styles.bottomContainer}>
        <Button
          title="Login With Spotify"
          onPress={() => handleLogin()}
          color="#fff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
  },
  topContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '50%',
    margin: 20,
  },
  image: {
    width: 300,
    height: 300,
    justifyContent: 'center',
  },
});
