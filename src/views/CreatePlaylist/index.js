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

const CreatePlaylist = ({route, navigation}) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const {createPlaylist} = route.params;

  const handlePress = async playlistName => {
    setLoading(true);
    await createPlaylist(playlistName);
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
              <AppTitle>New Playlist</AppTitle>
            </Body>
            <Right />
          </Header>

          <Content contentContainerStyle={styles.profile}>
            <Text
              style={{
                marginTop: 220,
                fontSize: 17,
                color: '#6e6e6e',
                fontWeight: 'bold',
              }}>
              Give your playlist a name
            </Text>
            <Item
              style={{
                marginTop: 50,
                width: '90%',
              }}>
              <Input
                textAlign="center"
                style={{fontSize: 30, fontWeight: 'bold', color: '#6e6e6e'}}
                onChangeText={playlistName => setName(playlistName)}
              />
            </Item>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 40,
              }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Text style={{color: theme.COLOR_DARK_GREY_100, fontSize: 13}}>
                  CANCEL
                </Text>
              </Button>
              <Button
                transparent
                style={{minWidth: 80}}
                onPress={() => handlePress(name)}>
                <Text style={{color: theme.COLOR_PRIMARY, fontSize: 13}}>
                  {name ? 'CREATE' : 'SKIP'}
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
