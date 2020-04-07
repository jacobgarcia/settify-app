import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Container, Content, Root, Text, Thumbnail} from 'native-base';
const Playlist = () => {
  const uri = 'https://live.staticflickr.com/5624/22923915864_56bba36dd2_b.jpg';

  return (
    <Root>
      <Container>
        <Content contentContainerStyle={styles.profile}>
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
export default Playlist;
