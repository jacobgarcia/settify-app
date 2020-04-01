import React from 'react';
import {
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

const Item = ({playlist, handleCheck, selectedRows, theme}) => (
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
    <Right>
      <Button transparent>
        <CheckBox
          checked={selectedRows.includes(playlist.id)}
          color={theme.COLOR_PRIMARY}
          onPress={() => handleCheck(playlist.id)}
        />
      </Button>
    </Right>
  </ListItem>
);

export default Item;
