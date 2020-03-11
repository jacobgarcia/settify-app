import React, {useState, useEffect} from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import {Linking} from 'expo';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Header,
  Left,
  List,
  ListItem,
  Right,
  Root,
  Text,
  Toast,
  Thumbnail,
} from 'native-base';

import theme from 'styles/theme.style.js';
import Notify from 'utils/Notify';
import {AppTitle} from './styled';
import API from 'api';

const ITEMS_PER_PAGE = 20;

const Playlists = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const page = 1;
      const offset = ITEMS_PER_PAGE * ((parseInt(page, 10) || 1) - 1);
      const {items} = await API.Spotify.GetPlaylists(offset);
      setData(items);
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

  const handleCheck = id => {
    if (selectedRows.includes(id)) {
      setSelectedRows(state => state.filter(e => e !== id));
    } else {
      setSelectedRows(state => [...state, id]);
    }
  };

  const getIntersection = async () => {
    try {
      setLoading(true);
      const [firstPlaylist, secondPlaylist] = selectedRows;
      const startTime = Date.now();
      const response = await API.Spotify.GetIntersection(
        firstPlaylist,
        secondPlaylist,
      );
      const endTime = Date.now();
      const time = endTime - startTime;

      if (response) {
        Alert.alert(
          `Your new playlist ${response.name} is ready!`,
          `${response.name} contains a total of ${
            response.tracks
          } tracks. You can check your playlist on Spotify right now or continue in Settify. It took me around ${time} ms to process this request.`,
          [
            {
              text: 'Take me there!',
              onPress: () =>
                Linking.openURL(
                  `https://open.spotify.com/playlist/${response.href}`,
                ),
              style: 'cancel',
            },
            {text: 'Continue'},
          ],
        );
      } else {
        Alert.alert(
          'Your playlist could not be created :(',
          `There are no tracks matching between the playlists. It took me around ${time} ms to process this request.`,
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      Notify.error('An error occured while intersecting the playlists', error);
    } finally {
      setSelectedRows([]);
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
          <Header>
            <AppTitle>My Playlists</AppTitle>
          </Header>
          <Content>
            <List>
              {data.map(playlist => (
                <ListItem
                  thumbnail
                  key={playlist.id}
                  onPress={() => handleCheck(playlist.id)}>
                  <Left>
                    <Thumbnail
                      square
                      source={{
                        uri: playlist.image,
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
                      <CheckBox
                        checked={selectedRows.includes(playlist.id)}
                        color={theme.COLOR_PRIMARY}
                        onPress={() => handleCheck(playlist.id)}
                      />
                    </Button>
                  </Right>
                </ListItem>
              ))}
            </List>
            {selectedRows.length === 2 &&
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['Cancel', 'Intersect', 'Unify', 'IntersectJS'],
                  cancelButtonIndex: 0,
                },
                buttonIndex => {
                  if (buttonIndex === 1) {
                    /* intersect action */
                    getIntersection();
                  }
                },
              )}
          </Content>
        </Container>
      )}
    </Root>
  );
};

const styles = StyleSheet.create({
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

export default Playlists;
