import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  Button,
  Container,
  Content,
  Input,
  Item,
  Root,
  Text,
  Toast,
} from 'native-base';

import API from 'api';
import theme from 'styles/theme.style.js';

const CreatePlaylist = ({
  navigation,
  placeholder,
  title,
  isNumeric,
  buttonText,
}) => {
  const [username, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    try {
      const offset = 20 * ((parseInt(1, 10) || 1) - 1);
      const {items} = await API.Spotify.GetUserPlaylists(offset, username);
      if (!items) {
        throw new Error('404');
      }
      navigation.navigate('Playlists', {username, screenIndex: 0});
    } catch (error) {
      if (error.message === '404') {
        navigation.push('NotFound', {username});
      } else {
        Toast.show({
          text: 'An error occured while getting the playlists',
          type: 'danger',
          textStyle: {
            textAlign: 'center',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.COLOR_PRIMARY} />
        </View>
      ) : (
        <Container>
          <Content contentContainerStyle={styles.inputScreenContainer}>
            <Text
              style={{
                marginTop: 220,
                fontSize: 17,
                color: '#6e6e6e',
                fontWeight: 'bold',
              }}>
              {title}
            </Text>

            <Item
              style={{
                marginTop: 50,
                width: '90%',
              }}>
              <Input
                textAlign="center"
                style={{fontSize: 30, fontWeight: 'bold', color: '#6e6e6e'}}
                onChangeText={playlistName => setUserName(playlistName)}
                placeholder={placeholder}
                placeholderTextColor={theme.COLOR_LIGHT_GREY_300}
                keyboardType={isNumeric ? 'numeric' : 'default'}
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
                  {buttonText.toUpperCase()}
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
  inputScreenContainer: {
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
});

CreatePlaylist.propTypes = {
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
};

CreatePlaylist.defaultProps = {
  placeholder: 'Username',
  buttonText: 'Get Playlists',
};

export default CreatePlaylist;
