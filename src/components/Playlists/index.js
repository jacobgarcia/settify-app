import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeModules,
  StyleSheet,
  View,
} from 'react-native';
import {Linking} from 'expo';
import {ActionSheet, Container, Root, Toast} from 'native-base';

import SingleItem from 'components/SingleItem';
import theme from 'styles/theme.style.js';
import Notify from 'utils/Notify';

import API from 'api';
import {intersect} from 'api/spotify';

import useAuth from 'hooks/auth';

const ITEMS_PER_PAGE = 20;

const Playlists = ({navigation, route}) => {
  const {username, screenIndex, rows} = route.params;
  const {getProfile} = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(rows || []);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    try {
      const offset = ITEMS_PER_PAGE * ((parseInt(page, 10) || 1) - 1);
      const {items} = await API.Spotify.GetUserPlaylists(offset, username);
      if (refreshing) {
        return setData(items);
      }
      if (items) {
        setData(prevData => {
          return [...prevData, ...items];
        });
      } else {
        setLoadingMore(false);
      }
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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  const handleCheck = (id, name) => {
    setPlaylistName(name);
    if (selectedRows.includes(id)) {
      setSelectedRows(state => state.filter(e => e !== id));
    } else {
      setSelectedRows(state => [...state, id]);
    }
  };

  const getNewPlaylistByMethod = async (method, name) => {
    try {
      setLoading(true);
      const [firstPlaylist, secondPlaylist] = selectedRows;
      const startTime = Date.now();
      const response = await method(firstPlaylist, secondPlaylist, name);
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
            {
              text: 'Continue',
              onPress: () => NativeModules.DevSettings.reload(),
            },
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

  const getIntersection = async name => {
    await getNewPlaylistByMethod(API.Spotify.GetIntersection, name);
  };

  const getUnion = async name => {
    await getNewPlaylistByMethod(API.Spotify.GetUnion, name);
  };

  const getIntersectionJS = async name => {
    await getNewPlaylistByMethod(intersect, name);
  };

  const navigateNextScreen = async () => {
    const {id} = await getProfile();
    navigation.push('Playlists', {
      username: JSON.parse(id),
      screenIndex: 1,
      rows: selectedRows,
    });
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }

    return (
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          paddingVertical: 20,
          marginTop: 10,
          marginBottom: 10,
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <Root>
      {loading ? (
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color={theme.COLOR_PRIMARY} />
        </View>
      ) : (
        <Container>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <SingleItem
                playlist={item}
                handleCheck={handleCheck}
                selectedRows={selectedRows}
                theme={theme}
              />
            )}
            keyExtractor={item => item.name}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            initialNumToRender={ITEMS_PER_PAGE}
            ListFooterComponent={renderFooter}
          />
          {selectedRows.length === 2 &&
            screenIndex === 1 &&
            ActionSheet.show(
              {
                options: ['Intersect', 'Unify', 'IntersectJS', 'Cancel'],
                cancelButtonIndex: 3,
                destructiveButtonIndex: 2,
                title: 'Apply a set method',
              },
              buttonIndex => {
                /* intersect action */
                if (buttonIndex === 0) {
                  navigation.navigate('CreatePlaylist', {
                    createPlaylist: getIntersection,
                  });
                }
                /* union action */
                if (buttonIndex === 1) {
                  navigation.navigate('CreatePlaylist', {
                    createPlaylist: getUnion,
                  });
                }
                /* intersection JS action */
                if (buttonIndex === 2) {
                  navigation.navigate('CreatePlaylist', {
                    createPlaylist: getIntersectionJS,
                  });
                }
                /* cancel action */
                if (buttonIndex === 3) {
                  setSelectedRows([]);
                }
              },
            )}
          {selectedRows.length === 1 &&
            screenIndex === 0 &&
            Alert.alert(playlistName, 'Are you sure to use this playlist?', [
              {
                text: 'Cancel',
                onPress: () => setSelectedRows([]),
                style: 'cancel',
              },
              {
                text: 'Continue',
                onPress: async () => await navigateNextScreen(),
              },
            ])}
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
