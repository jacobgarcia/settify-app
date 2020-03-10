import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {AsyncStorage} from 'react-native';
import API from 'api';

const AuthContext = React.createContext();
export const SPOTIFY_TOKEN = 'spotifyToken';
export const TOKEN_EXPIRATION = 'tokenExpiration';
export const NAME = 'name';
export const EMAIL = 'email';
export const ID = 'id';
export const IMAGE = 'image';

/**
 * Returns the user profile from the local storage
 * @returns {Object}
 */
const getProfile = async () => {
  try {
    const name = await AsyncStorage.getItem(NAME);
    const email = await AsyncStorage.get(EMAIL);
    const image = await AsyncStorage.get(IMAGE);
    return {
      name,
      email,
      image,
    };
  } catch (error) {
    console.error(error);
  }
};

const setProfile = async (name, email, id, image) => {
  try {
    await AsyncStorage.setItem(NAME, JSON.stringify(name));
    await AsyncStorage.setItem(EMAIL, JSON.stringify(email));
    await AsyncStorage.setItem(ID, JSON.stringify(id));
    await AsyncStorage.setItem(IMAGE, JSON.stringify(image));
  } catch (error) {
    console.error(error);
  }
};

export const AuthProvider = ({children}) => {
  const [hasToken, setHasToken] = useState(async () => {
    try {
      const token = await AsyncStorage.getItem(SPOTIFY_TOKEN);
      if (token !== null) {
        return token;
      }
      return false;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  /**
   * Used to know if the user role is being retrieved
   * initialized in true due we need to ensure that
   * no initial render is made without that information
   */
  const [isLoading, setIsLoading] = useState(true);

  const setToken = async tokenData => {
    try {
      await AsyncStorage.setItem(SPOTIFY_TOKEN, JSON.stringify(tokenData));
      if (tokenData) {
        setHasToken(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const authenticate = async tokenData => {
    try {
      // Then set the token to avoid errors in expected values
      await setToken(tokenData);
      // Then make a call to the API to get the user information
      const {
        display_name: name,
        id,
        email,
        images,
      } = await API.Spotify.GetProfile();
      await setProfile(name, email, id, images);
    } catch (error) {
      console.error('Ocurrió un error en el servidor al iniciar sesión.');
    }
  };

  const getToken = () => {
    try {
      return AsyncStorage.getItem(SPOTIFY_TOKEN);
    } catch (error) {
      return error;
    }
  };

  const removeSession = async () => {
    try {
      await AsyncStorage.removeItem(SPOTIFY_TOKEN);
      await AsyncStorage.removeItem(NAME);
      await AsyncStorage.removeItem(EMAIL);
      setHasToken(false);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * This effect runs whenever the user logs in or logs out
   * is used to check expiration of the token
   */
  useEffect(() => {
    async function checkToken() {
      if (await hasToken) {
        const {expiration} = await getToken();
        if (Date.now() > expiration) {
          await removeSession();
        }
      } else {
        setIsLoading(false);
      }
    }
    checkToken();
  }, [hasToken]);

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        hasToken,
        getProfile,
        getToken,
        removeSession,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
