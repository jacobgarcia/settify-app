import React from 'react';
import {Body, Left, ListItem, Text, Thumbnail} from 'native-base';
import capitalize from 'capitalize';

const Item = ({playlist, handleCheck, selectedRows, theme}) => {
  return (
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
          {`by ${capitalize(playlist.owner)}`}
        </Text>
      </Body>
    </ListItem>
  );
};

export default Item;
