import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ProgressViewIOS,
  NativeModules,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AuthSession} from 'expo';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Toast,
  Root,
} from 'native-base';

import {Title, Subtitle, AppTitle, PlaylistsContainer} from './styled';
import LoginButton from 'components/Button';
import Logo from 'assets/image.png';
import useAuth from 'hooks/auth';
import defaultData from './data';
import API from 'api';

const ITEMS_PER_PAGE = 20;

const Playlists = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const page = 1;
      const offset = ITEMS_PER_PAGE * ((parseInt(page, 10) || 1) - 1);
      const {items, total} = await API.Spotify.GetPlaylists(offset);
      setData(items);
    } catch (error) {
      const debug = require('reactotron-react-native').default;
      console.log(error);
      Toast.show({
        text: 'An error occured while getting the playlists',
        type: 'danger',
        textStyle: {
          textAlign: 'center',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <Container>
        <Header>
          <AppTitle>My Playlists</AppTitle>
        </Header>
        <Content>
          <List>
            {data.map(playlist => (
              <ListItem thumbnail key={playlist.id}>
                <Left>
                  <Thumbnail
                    square
                    source={{
                      uri: playlist.image.url,
                    }}
                  />
                </Left>
                <Body>
                  <Text>{playlist.name}</Text>
                  <Text note numberOfLines={1}>
                    by {playlist.owner}
                  </Text>
                </Body>
                <Right>
                  <Button transparent>
                    <Text>View</Text>
                  </Button>
                </Right>
              </ListItem>
            ))}
          </List>
        </Content>
      </Container>
    </Root>
  );
};

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const Login = () => {
  const {authenticate, hasToken} = useAuth();
  const [selectedTab, setSelectedTab] = useState(null);
  const [isAuth, setIsAuth] = useState(true);

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
          <ProgressViewIOS number={1} />
          <View style={styles.bottomContainer}>
            <LoginButton
              title="Login With Spotify"
              onPress={() => handleLogin()}
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
});

export default Login;
