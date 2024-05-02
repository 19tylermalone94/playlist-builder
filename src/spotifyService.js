import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

export const fetchTracks = (query, token) => {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=track`,
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

export const fetchAudioFeatures = (trackId, token) => {
  return axios({
    method: 'GET',
    url: `${BASE_URL}/audio-features/${trackId}`,
    headers: { 'Authorization': `Bearer ${token}` }
  });
};