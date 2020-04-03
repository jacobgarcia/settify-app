import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  Button,
  Container,
  Content,
  Header,
  Input,
  Item,
  Left,
  Body,
  Right,
  Root,
  Text,
} from 'native-base';

import {AppTitle} from 'components/AppTitle';

import theme from 'styles/theme.style.js';

const CreatePlaylist = ({navigation}) => {
  const [username, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    navigation.navigate('Playlists', {username});
  };

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
              <AppTitle>Social</AppTitle>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={styles.profile}>
            <Item
              style={{
                marginTop: 220,
                width: '90%',
              }}>
              <Input
                textAlign="center"
                style={{fontSize: 30, fontWeight: 'bold', color: '#6e6e6e'}}
                onChangeText={playlistName => setUserName(playlistName)}
                placeholder="Username"
                placeholderTextColor={theme.COLOR_LIGHT_GREY_300}
              />
            </Item>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 40,
              }}>
              <Button
                transparent
                disabled={username.length <= 0}
                style={{minWidth: 80}}
                onPress={() => handlePress()}>
                <Text style={{color: theme.COLOR_PRIMARY, fontSize: 13}}>
                  GET PLAYLISTS
                </Text>
              </Button>
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
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
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

export default CreatePlaylist;
