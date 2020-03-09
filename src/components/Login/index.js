import React from 'react';
import {StyleSheet, View, Image, ProgressViewIOS} from 'react-native';
import {AuthSession} from 'expo';

import Logo from 'assets/image.png';
import {Title, Subtitle} from './styled';
import Button from 'components/Button';
import useAuth from 'hooks/auth';

const Login = () => {
  const {authenticate, hasToken} = useAuth();
  console.log(hasToken);
  const testLogin = async () => {
    try {
      await authenticate({
        token: 'token',
        expiration: parseInt(Date.now(), 10) + parseInt(3600 * 1000, 10),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogin = async () => {
    try {
      const redirectUrl = AuthSession.getRedirectUrl();
      const data = await AuthSession.startAsync({
        authUrl: `https://accounts.spotify.com/authorize?client_id=8be10436cdeb41deab45fc7502265679&redirect_uri=${encodeURIComponent(
          redirectUrl,
        )}&scope=user-read-private%20user-read-email%20playlist-modify-public&response_type=token&state=123`,
      });

      // Set token
      const {access_token: token, expires_in: expiration} = data.params;
      if (token) {
        // Set token
        authenticate({
          token,
          expiration:
            parseInt(Date.now(), 10) + parseInt(expiration * 1000, 10),
        });
      }
    } catch (error) {
      console.error(error);
    }
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
          onPress={() => testLogin()}
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

export default Login;
