import axios from 'axios';
import {AsyncStorage, NativeModules} from 'react-native';
import queryString from 'query-string';

import {REACT_APP_API_URL as baseURL} from 'react-native-dotenv';

const SETTIFY_TOKEN_NAME = 'spotifyToken';

const handleUnauthorized = async ({status}) => {
  if (status === 401) {
    try {
      await AsyncStorage.removeItem(SETTIFY_TOKEN_NAME);
    } catch (error) {
      console.error(error);
    } finally {
      NativeModules.DevSettings.reload();
    }
  }

  if (status === 403) {
    throw new Error('Forbidden');
  }

  if (status === 404) {
    throw new Error(404);
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
    try {
      const {token} =
        JSON.parse(await AsyncStorage.getItem(SETTIFY_TOKEN_NAME)) || {};
      headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error(error);
    }
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
      port: 5000,
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

const Spotify = {
  GetPlaylists: offset => request({url: `/playlists?offset=${offset}`}),
  GetIntersection: (firstPlaylist, secondPlaylist, name) =>
    request({
      url: `/intersection?firstPlaylist=${firstPlaylist}&secondPlaylist=${secondPlaylist}&name=${name}`,
    }),
  GetUnion: (firstPlaylist, secondPlaylist, name) =>
    request({
      url: `/union?firstPlaylist=${firstPlaylist}&secondPlaylist=${secondPlaylist}&name=${name}`,
    }),
  GetProfile: () => request({url: '/me'}),
  GetUserPlaylists: (offset, username) =>
    request({url: `/user/playlists?offset=${offset}&username=${username}`}),
};

export default {
  Spotify,
};
