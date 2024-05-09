import { useSpotifyToken } from './SpotifyAuthContext';
import { kmeansClusters } from './kmeans';
import Track from './Track';
import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';
const TRACK_IDS_FILE_PATH = '/track_ids.csv';

export function useSpotifyService() {
  const token = useSpotifyToken();

  const getTracksBySearch = async (query) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/search?q=${encodeURIComponent(query)}&type=track`,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return createTracks(response.data.tracks.items);
    } catch (error) {
      console.error('Error getting tracks by search:', error);
      return [];
    }
  };

  const createTracks = async (items) => {
    const ids = items.map(item => item.id);
    const featuresList = await getFeaturesSeveralTracks(ids);
    return items.map((item, index) => {
      const id = item.id;
      const trackName = item.name;
      const artistName = item.artists.map(artist => artist.name).join(", ");
      const albumArtUrl = item.album.images[0]?.url || '';
      const previewUrl = item.preview_url;
      const features = featuresList[index];
      return new Track(id, trackName, artistName, albumArtUrl, previewUrl, features);
    });
  };

  const getFeaturesSeveralTracks = async (trackIDs) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BASE_URL}/audio-features?ids=${trackIDs.join(',')}`,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.audio_features.map(item => {
        return [
          item.acousticness,
          item.danceability,
          item.duration_ms, 
          item.energy,
          item.instrumentalness,
          item.liveness,
          item.loudness,
          item.speechiness,
          item.tempo,
          item.valence
        ];
      });
    } catch (error) {
      console.error('Error getting several tracks\' features:', error);
      return [];
    }
  };

  const getClusters = async (trackIDs) => {
    const userTracks = await createTracks(await getSeveralTracks(trackIDs));
    const randomTracks = await getRandomTracks();
    return kmeansClusters(userTracks, randomTracks);
  };

  const getRandomTracks = async () => {
    return await createTracks(await getSeveralTracks(await getRandomTrackIDs(100)));
  };

  const getSeveralTracks = async (trackIDs) => {
    const maxBatchSize = 50;
    let allTracks = [];
    
    const chunkArray = (array, size) => {
      const chunkedArr = [];
      for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
      }
      return chunkedArr;
    };

    const batches = chunkArray(trackIDs, maxBatchSize);

    for (const batch of batches) {
      try {
        const response = await axios({
          method: 'GET',
          url: `${BASE_URL}/tracks?ids=${batch.join(',')}`,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        allTracks = allTracks.concat(response.data.tracks);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
    return allTracks;
  };

  const getRandomTrackIDs = async (numIDs) => {
    try {
      const response = await fetch(TRACK_IDS_FILE_PATH);
      const data = await response.text();
      const trackIDs = data.split('\n').map(line => line.trim()).filter(Boolean);
      return shuffleArray(trackIDs).slice(0, numIDs);
    } catch (error) {
      console.error('Error fetching random track IDs:', error);
      return [];
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return {
    getTracksBySearch,
    getClusters
  };
}