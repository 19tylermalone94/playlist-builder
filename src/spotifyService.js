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
  const numSearches = 10; // Number of searches to perform
  const tracksPerSearch = 10; // Number of tracks to fetch per search
  let collectedTracks = [];

  // Function to generate a random search query
  const generateRandomSearchQuery = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    return `%${randomLetter}%`;
  };

  // Perform searches
  for (let i = 0; i < numSearches; i++) {
    const searchQuery = generateRandomSearchQuery();
    try {
      const response = await fetchTracks(searchQuery, token); // Make sure this function handles the search correctly
      const tracks = response.data.tracks.items;
      if (tracks.length > 0) {
        collectedTracks.push(...tracks.slice(0, tracksPerSearch));
      }
    } catch (error) {
      console.error('Error fetching tracks with query:', searchQuery, error);
    }
  }

  // Trim the collectedTracks array to the maximum size of 100
  return collectedTracks.slice(0, 100);
};
