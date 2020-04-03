import React from 'react';
import {Body, Left, ListItem, Radio, Right, Text, Thumbnail} from 'native-base';
import capitalize from 'capitalize';

const SingleItem = ({playlist, handleCheck, selectedRows, theme}) => (
  <ListItem
    thumbnail
    key={playlist.id}
    onPress={() => handleCheck(playlist.id, playlist.name)}
    color={theme.COLOR_PRIMARY}>
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
    <Right>
      <Radio
        selected={selectedRows.includes(playlist.id)}
        selectedColor={theme.COLOR_PRIMARY}
      />
    </Right>
  </ListItem>
);

export default SingleItem;
