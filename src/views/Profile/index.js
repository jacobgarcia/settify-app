import React, {useState, useEffect} from 'react';
import {ActivityIndicator, NativeModules, StyleSheet, View} from 'react-native';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Root,
  Text,
  Thumbnail,
  Toast,
} from 'native-base';
import {Ionicons} from '@expo/vector-icons';

import {AppTitle} from 'components/AppTitle';
import LoginButton from 'components/Button';

import useAuth from 'hooks/auth';
import theme from 'styles/theme.style.js';

import API from 'api';

const ProfileScreen = () => {
  const [user, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {removeSession} = useAuth();

  useEffect(() => {
    getData();
  }, []);

  const logout = async () => {
    await removeSession();
    NativeModules.DevSettings.reload();
  };

  const getData = async () => {
    try {
      const data = await API.Spotify.GetProfile();
      setData(data);
    } catch (error) {
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

  const uri =
    'https://www.pngkey.com/png/detail/230-2301779_best-classified-apps-default-user-profile.png';

  return (
    <Root>
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.COLOR_PRIMARY} />
        </View>
      ) : (
        <Container>
          <Header style={{backgroundColor: theme.COLOR_PRIMARY}}>
            <Left />
            <Body>
              <AppTitle>Profile</AppTitle>
            </Body>
            <Right />
          </Header>

          <Content contentContainerStyle={styles.profile}>
            <Thumbnail
              style={{
                height: 120,
                width: 120,
                borderRadius: 120 / 2,
                marginTop: 40,
              }}
              large
              source={{uri: user.images ? user.images[0].url : uri}}
            />
            <Text
              style={{
                marginTop: 20,
                fontSize: 25,
                fontWeight: 'bold',
                color: '#6e6e6e',
              }}>
              {user.display_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 100,
              }}>
              <Ionicons
                name="ios-person"
                style={{
                  fontSize: 35,
                  color: '#6e6e6e',
                  marginRight: 20,
                }}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 20,
                  color: '#6e6e6e',
                }}>
                {user.id}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <Ionicons
                name="ios-mail"
                style={{
                  fontSize: 35,
                  color: '#6e6e6e',
                  marginRight: 20,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  color: '#6e6e6e',
                  marginTop: 4,
                }}>
                {user.email}
              </Text>
            </View>
            <View style={styles.logoutButtonContainer}>
              <LoginButton text="LOGOUT" onPress={() => logout()} />
            </View>
          </Content>
        </Container>
      )}
    </Root>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoutButtonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: 160,
  },
  button: {
    minWidth: 160,
    marginLeft: 80,
  },
});

export default ProfileScreen;
