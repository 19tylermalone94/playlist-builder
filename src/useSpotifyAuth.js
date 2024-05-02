import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSpotifyAuth = (client_id, client_secret) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    };

    axios(authOptions)
      .then(response => {
        setToken(response.data.access_token);
      })
      .catch(error => console.error('Failed to authenticate', error));

    return () => setToken('');
  }, [client_id, client_secret]);

  return token;
};