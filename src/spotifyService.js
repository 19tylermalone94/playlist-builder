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

export const fetchRandomTracks = async (token) => {
  const numSearches = 10;
  const tracksPerSearch = 10;
  let collectedTracks = [];

  const generateRandomSearchQuery = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    return `%${randomLetter}%`;
  };

  for (let i = 0; i < numSearches; i++) {
    const searchQuery = generateRandomSearchQuery();
    try {
      const response = await fetchTracks(searchQuery, token);
      const tracks = response.data.tracks.items;
      if (tracks.length > 0) {
        collectedTracks.push(...tracks.slice(0, tracksPerSearch));
      }
    } catch (error) {
      console.error('Error fetching tracks with query:', searchQuery, error);
    }
  }

  return collectedTracks.slice(0, 100);
};
