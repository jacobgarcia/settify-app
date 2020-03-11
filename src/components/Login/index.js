import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, NativeModules, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthSession} from 'expo';
import {Ionicons} from '@expo/vector-icons';
import {Container, Header, Content, Thumbnail} from 'native-base';
import Playlists from 'views/Playlists';
import LoginButton from 'components/Button';
import Logo from 'assets/image.png';
import useAuth from 'hooks/auth';
import theme from 'styles/theme.style.js';
import {Title, Subtitle} from './styled';

function SettingsScreen() {
  const uri = 'https://randomuser.me/api/portraits/men/32.jpg';
  return (
    <Container>
      <Header />
      <Content contentContainerStyle={styles.logo}>
        <Thumbnail
          style={{height: 120, width: 120, borderRadius: 120 / 2}}
          large
          source={{uri: uri}}
        />
      </Content>
    </Container>
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
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Playlists') {
                  iconName = 'ios-musical-notes';
                } else if (route.name === 'Settings') {
                  iconName = 'ios-settings';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: theme.COLOR_PRIMARY,
              inactiveTintColor: 'gray',
            }}>
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
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default Login;
