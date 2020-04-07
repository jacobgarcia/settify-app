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
import {
  ActionSheet,
  Body,
  Container,
  Header,
  Left,
  Right,
  Root,
  Toast,
} from 'native-base';

import Item from 'components/Item';
import theme from 'styles/theme.style.js';
import Notify from 'utils/Notify';

import API from 'api';
import {intersect} from 'api/spotify';
import {AppTitle} from './styled';

const ITEMS_PER_PAGE = 20;

const Playlists = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getData();
  }, [page, refetch]);

  const getData = async () => {
    try {
      const offset = ITEMS_PER_PAGE * ((parseInt(page, 10) || 1) - 1);
      const {items} = await API.Spotify.GetPlaylists(offset);
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
    // We start a pull refresh action, we update our current refreshing state
    setRefreshing(true);

    // If the page is 1, we still need to call our getData function, but, since the page is 1, there
    // is no useEffect run and no getData call. We use our refetch flag in order to do so.
    if (page === 1) {
      setRefetch(prevData => ++prevData);
    } else {
      setPage(1);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setPage(prevPage => prevPage + 1);
  };

  const handleCheck = id => {
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
              <Item
                playlist={item}
                handleCheck={handleCheck}
                selectedRows={selectedRows}
                theme={theme}
              />
            )}
            keyExtractor={item => item.id}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            initialNumToRender={ITEMS_PER_PAGE}
            ListFooterComponent={renderFooter}
          />
          {selectedRows.length === 2 &&
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
