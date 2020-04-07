import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {Container, Root, Text, Thumbnail, Toast} from 'native-base';
import SongItem from 'components/SongItem';
import theme from 'styles/theme.style.js';
import API from 'api';

const ITEMS_PER_PAGE = 20;

const Playlist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const uri = 'https://live.staticflickr.com/5624/22923915864_56bba36dd2_b.jpg';

  useEffect(() => {
    getData();
  }, [page]);

  const getData = async () => {
    try {
      const offset = ITEMS_PER_PAGE * ((parseInt(page, 10) || 1) - 1);
      const {items} = await API.Spotify.GetPlaylists(offset);
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
      <Container>
        <View style={styles.profile}>
          <Thumbnail
            style={{
              height: 200,
              width: 200,
              marginTop: 40,
              borderRadius: 0,
            }}
            large
            source={{uri: uri}}
          />
          <Text
            style={{
              marginTop: 20,
              fontSize: 25,
              fontWeight: 'bold',
              color: '#6e6e6e',
            }}>
            Untold Stories
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: '#6e6e6e',
              marginTop: 5,
            }}>
            BY SPOTIFY - 148.8K LIKES
          </Text>
        </View>

        <FlatList
          data={data}
          renderItem={({item}) => (
            <SongItem
              playlist={item}
              handleCheck={handleCheck}
              selectedRows={selectedRows}
              theme={theme}
            />
          )}
          keyExtractor={item => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          initialNumToRender={ITEMS_PER_PAGE}
          ListFooterComponent={renderFooter}
        />
      </Container>
    </Root>
  );
};

const styles = StyleSheet.create({
  profile: {
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
export default Playlist;
