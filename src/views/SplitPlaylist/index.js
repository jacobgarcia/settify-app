import React from 'react';
import InputScreen from 'components/InputScreen';

const SplitPlaylist = () => {
  return (
    <InputScreen
      placeholder="Track Limit"
      title="Specify the track limit of each playlist"
      buttonText="Split Playlist"
      isNumeric
    />
  );
};

export default SplitPlaylist;
