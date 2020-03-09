import axios from 'axios';
import store from 'store';
import queryString from 'query-string';
import {uniqueNamesGenerator, adjectives, colors} from 'unique-names-generator';

const customConfig = {
  dictionaries: [adjectives, colors],
  separator: ' ',
  length: 2,
};

const shortName = () => uniqueNamesGenerator(customConfig);

const SETTIFY_TOKEN_NAME = 'spotifyToken';

const baseURL = process.env.REACT_APP_SPOTIFY_API_URL;

const handleUnauthorized = ({status}) => {
  if (status === 401) {
    store.remove(SETTIFY_TOKEN_NAME);
    window.location.reload();
  }

  if (status === 403) {
    throw new Error('Forbidden');
  }

  throw new Error('Unexpected server error');
};

const request = async ({
  url,
  data,
  method,
  skipAuth = false,
  isFormPost = false,
  isFile = false,
}) => {
  const contentType = isFormPost
    ? 'application/x-www-form-urlencoded'
    : 'application/json';

  const headers = {'Content-Type': contentType};

  if (!skipAuth) {
    headers.Authorization = `Bearer ${store.get(SETTIFY_TOKEN_NAME).token}`;
  }

  try {
    let responseType = 'json';
    if (isFormPost) {
      responseType = 'arraybuffer';
    } else if (isFile) {
      responseType = 'blob';
    }

    const response = await axios({
      baseURL,
      url,
      headers,
      data: isFormPost ? queryString.stringify(data) : data,
      method: method || (data ? 'post' : 'get'),
      responseType,
    });

    if (isFormPost) {
      return response;
    }

    return response.data;
  } catch (error) {
    const {status, data: message} = error.response;

    return handleUnauthorized({status, message, reload: !skipAuth});
  }
};

const Client = {
  GetPlaylist: id => request({url: `/playlists/${id}`}),
  GetProfile: () => request({url: '/me'}),
  CreatePlaylist: (id, data) =>
    request({
      url: `/users/${id}/playlists`,
      data,
    }),
  AddTracks: (playlist, data) =>
    request({url: `/playlists/${playlist}/tracks`, data}),
};

const operation = async (firstPlaylist, secondPlaylist, method) => {
  // First we need to retrieve the first playlist tracks
  try {
    const first = await Client.GetPlaylist(firstPlaylist);
    const second = await Client.GetPlaylist(secondPlaylist);
    const intersection = method(first.tracks.items, second.tracks.items);

    if (intersection.length === 0) {
      throw new Error();
    }

    // Next, we need the user.id of the current session.
    // This is a requirement to create the new playlist.
    const user = await Client.GetProfile();
    const name = shortName();

    // Next, we create the empty playlist with a new random name
    const playlist = await Client.CreatePlaylist(user.id, {name});

    // Finally, we need to add the tracks to the playlist
    const uris = intersection.map(track => {
      return track.uri;
    });

    await Client.AddTracks(playlist.id, {uris});

    return {
      name,
      href: playlist.id,
      tracks: uris.length,
    };
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

const getIntersection = (firstPlaylistTracks, secondPlaylistTracks) => {
  const intersection = [];
  firstPlaylistTracks.forEach(firstItem => {
    secondPlaylistTracks.forEach(secondItem => {
      if (firstItem.track.id === secondItem.track.id) {
        const playlist = {
          id: firstItem.track.id,
          name: firstItem.track.name,
          uri: firstItem.track.uri,
        };
        intersection.push(playlist);
      }
    });
  });
  return intersection;
};

// const getOptimizedIntersection = (
//   firstPlaylistTracks,
//   secondPlaylistTracks
// ) => {
//   const intersection = firstPlaylistTracks.filter(
//     ((set) => (a) => set.has(a.track.id))(
//       new Set(secondPlaylistTracks.map((b) => b.track.id))
//     )
//   );
//   return intersection;
// };

const intersect = async (firstPlaylist, secondPlaylist) => {
  return operation(firstPlaylist, secondPlaylist, getIntersection);
};

export {Client, intersect};
