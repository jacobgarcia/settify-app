import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Container, Content, Text} from 'native-base';
import {Ionicons} from '@expo/vector-icons';

const NotFound = ({route}) => {
  const {username} = route.params;
  return (
    <Container>
      <Content contentContainerStyle={styles.profile}>
        <Ionicons
          name="ios-flag"
          style={{
            fontSize: 100,
            color: '#6e6e6e',
            marginTop: 200,
          }}
        />
        <Text
          style={{
            fontSize: 15,
            color: '#6e6e6e',
            marginTop: 10,
            fontWeight: 'bold',
            maxWidth: 280,
            textAlign: 'center',
          }}>
          No playlists found for "{username}"
        </Text>
        <View style={{maxWidth: 210}}>
          <Text
            style={{
              fontSize: 10,
              color: '#6e6e6e',
              marginTop: 20,
              textAlign: 'center',
            }}>
            Please check you have right spelling, or try a different username
          </Text>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default NotFound;
