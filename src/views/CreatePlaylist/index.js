import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

const CreatePlaylist = () => {
  const [name, setName] = useState('');
  return (
    <Root>
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
            Give your playlist a name.
          </Text>
          <Item
            style={{
              marginTop: 50,
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
            <Button transparent>
              <Text style={{color: theme.COLOR_DARK_GREY_100, fontSize: 13}}>
                CANCEL
              </Text>
            </Button>
            <Button transparent style={{minWidth: 80}}>
              <Text style={{color: theme.COLOR_PRIMARY, fontSize: 13}}>
                {name ? 'CREATE' : 'SKIP'}
              </Text>
            </Button>
          </View>
        </Content>
      </Container>
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

export default CreatePlaylist;
