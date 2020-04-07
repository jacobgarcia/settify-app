import React, {useState, useEffect} from 'react';
import {Dimensions, StyleSheet, View, Image, NativeModules} from 'react-native';
import {AuthSession} from 'expo';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginButton from 'components/Button';
import Logo from 'assets/image.png';
import useAuth from 'hooks/auth';
import {Title, Subtitle} from './styled';

import CreatePlaylist from 'views/CreatePlaylist';
import Home from 'views/Home';

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width / 2);
const imageWidth = dimensions.width / 2;

const Login = () => {
  const {authenticate, hasToken} = useAuth();
  const [isAuth, setIsAuth] = useState(false);
  const Stack = createStackNavigator();

  useEffect(() => {
    syncHasToken();
  }, []);

  const handleLogin = async () => {
    try {
      const redirectUrl = AuthSession.getRedirectUrl();
      const data = await AuthSession.startAsync({
        authUrl: `https://accounts.spotify.com/authorize?client_id=8be10436cdeb41deab45fc7502265679&redirect_uri=${encodeURIComponent(
          redirectUrl,
        )}&scope=user-read-private%20user-read-email%20playlist-modify-public%20playlist-read-private&response_type=token&state=123`,
      });

      // Check if it's not the cancel button
      if (data.params) {
        // Set token
        const {access_token: token, expires_in: expiration} = data.params;
        if (token) {
          // Set token
          await authenticate({
            token,
            expiration:
              parseInt(Date.now(), 10) + parseInt(expiration * 1000, 10),
          });
          NativeModules.DevSettings.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const syncHasToken = async () => {
    const isAuth = await hasToken;
    setIsAuth(isAuth);
  };

  return (
    <>
      {!isAuth ? (
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
          <View style={styles.bottomContainer}>
            <LoginButton
              text="LOGIN WITH SPOTIFY"
              styles={styles.button}
              onPress={() => handleLogin()}
            />
          </View>
        </View>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="CreatePlaylist" component={CreatePlaylist} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
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
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settings: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    minWidth: 160,
  },
});

export default Login;
