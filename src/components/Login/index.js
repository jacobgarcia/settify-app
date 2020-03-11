import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, NativeModules, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthSession} from 'expo';

import Playlists from 'views/Playlists';
import LoginButton from 'components/Button';
import Logo from 'assets/image.png';
import useAuth from 'hooks/auth';
import {Title, Subtitle} from './styled';

function SettingsScreen() {
  return (
    <View style={styles.settings}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Login = () => {
  const {authenticate, hasToken} = useAuth();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    syncHasToken();
  }, []);

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
        NativeModules.DevSettings.reload();
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
              text="Login With Spotify"
              onPress={() => handleLogin()}
              rounded
              color="#fff"
            />
          </View>
        </View>
      ) : (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Playlists" component={Playlists} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
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
    alignItems: 'flex-start',
    width: '50%',
    margin: 20,
  },
  image: {
    width: 300,
    height: 300,
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
});

export default Login;
