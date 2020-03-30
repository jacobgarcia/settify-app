import React from 'react';
import {Container, Header, Content, Thumbnail, Text, View} from 'native-base';
import theme from 'styles/theme.style.js';

function SettingsScreen() {
  const uri = 'https://randomuser.me/api/portraits/men/32.jpg';
  return (
    <Container>
      <Header style={{backgroundColor: theme.COLOR_PRIMARY}} />
      <Content contentContainerStyle={styles.logo}>
        <Thumbnail
          style={{
            height: 120,
            width: 120,
            borderRadius: 120 / 2,
            marginTop: 40,
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
          Jacob Garcia
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 100,
          }}>
          <Ionicons
            name="ios-person"
            style={{
              fontSize: 35,
              color: '#6e6e6e',
              marginRight: 20,
            }}
          />
          <Text
            style={{
              marginTop: 4,
              fontSize: 20,
              color: '#6e6e6e',
            }}>
            fatalraincloud
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Ionicons
            name="ios-mail"
            style={{
              fontSize: 35,
              color: '#6e6e6e',
              marginRight: 20,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              color: '#6e6e6e',
              marginTop: 4,
            }}>
            rock2494@hotmail.com
          </Text>
        </View>
      </Content>
    </Container>
  );
}

export default SettingsScreen;
