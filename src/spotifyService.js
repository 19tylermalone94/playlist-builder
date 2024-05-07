import Song from './Song';
import axios from 'axios';

const API_URL = 'https://api.spotify.com/v1';

async function getAuthToken() {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  const response = await axios.post(tokenUrl, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${process.env.REACT_APP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)}`
    }
  });
  return response.data.access_token;
}

export async function getSongsBySearch(query) {
  const token = await getAuthToken();
  const response = await axios.get(API_URL + `/search?type=track&q=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data.tracks.items.map(item => new Song(
    item.name,
    item.acousticness,
    item.danceability,
    item.energy,
    item.instrumentalness,
    item.liveness,
    item.loudness,
    item.speechiness,
    item.tempo,
    item.valence,
    item.album.images[0].url,
    item.artists
  ));
}

function getRandomSearchQuery() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const char1 = characters.charAt(Math.floor(Math.random() * characters.length));
  const char2 = characters.charAt(Math.floor(Math.random() * characters.length));
  return char1 + char2;
}

export async function getRandomSongs() {
  const randomQuery = getRandomSearchQuery();
  return await getSongsBySearch(randomQuery);
}
