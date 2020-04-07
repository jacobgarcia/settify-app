import React from 'react';
import {Platform} from 'react-native';

import {
  Badge,
  Body,
  Button,
  CheckBox,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail,
} from 'native-base';
import capitalize from 'capitalize';

import {useNavigation} from '@react-navigation/native';

const Item = ({playlist, handleCheck, selectedRows, theme}) => {
  const navigation = useNavigation();

  return (
    <ListItem
      thumbnail
      key={playlist.id}
      onPress={() => handleCheck(playlist.id)}>
      <Left>
        <Button transparent onPress={() => navigation.navigate('Details')}>
          <Thumbnail
            square
            source={{
              uri: playlist.image,
            }}
          />
        </Button>
      </Left>
      <Body>
        <Text>{playlist.name}</Text>
        <Text note numberOfLines={1}>
          {`by ${capitalize(playlist.owner)}`}
        </Text>
      </Body>
      <Right>
        <Button transparent onPress={() => handleCheck(playlist.id)}>
          {!selectedRows.includes(playlist.id) ? (
            <CheckBox
              checked={selectedRows.includes(playlist.id)}
              color={theme.COLOR_PRIMARY}
              style={{marginRight: 10, width: 25, height: 25}}
              onPress={() => handleCheck(playlist.id)}
              disabled={true}
            />
          ) : (
            <Badge
              style={{
                backgroundColor: theme.COLOR_PRIMARY,
                width: 25,
                height: 25,
                borderRadius: Platform.OS === 'ios' ? 25 : 0,
              }}>
              <Text
                style={{
                  fontSize: 11,
                  paddingBottom: 20,
                }}>
                {selectedRows.findIndex(element => element === playlist.id) + 1}
              </Text>
            </Badge>
          )}
        </Button>
      </Right>
    </ListItem>
  );
};

export default Item;
