import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SpotifyAuthContext = createContext();

export const useSpotifyToken = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children, client_id, client_secret }) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${client_id}:${client_secret}`)}`
      };

      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', params, { headers });
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Failed to retrieve Spotify token:', error);
      }
    };

    getToken();
  }, [client_id, client_secret]);

  return (
    <SpotifyAuthContext.Provider value={token}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};
