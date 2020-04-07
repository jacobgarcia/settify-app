import React from 'react';

import {Body, Button, Left, ListItem, Text, Thumbnail} from 'native-base';
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
    </ListItem>
  );
};

export default Item;
