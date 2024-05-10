import { useSpotifyToken } from './SpotifyAuthContext';
import { kmeansClusters } from './kmeans';
import Track from './Track';
import SimpleTrack from './SimpleTrack';
import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';
const TRACKS_FILE_PATH = '/tracks.csv';

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

  const createSimpleTracks = async (items) => {
    const ids = items.map(item => item.id);
    const featuresList = await getFeaturesSeveralTracks(ids);
    return items.map((item, index) => {
      const id = item.id;
      const features = featuresList[index];
      return new SimpleTrack(id, features);
    });
  };

  const simpleTracksToTracks = async (simpleTracks) => {
    return await createTracks(await getSeveralTracks(simpleTracks.map(st => st.id)));
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

  const getClusters = async (trackIDs, selectedGenres) => {
    const userTracks = await createSimpleTracks(await getSeveralTracks(trackIDs));
    const population = await getTracksFromFile();
    const weights = calculateGenreWeights(selectedGenres);
    const { centroids, topTenClusters } = kmeansClusters(userTracks, population, weights);
    const trackCentroids = await simpleTracksToTracks(centroids);
    const trackClusters = await Promise.all(topTenClusters.map(async (cluster) => {
        return await simpleTracksToTracks(cluster);
    }));

    console.log("getClusters");
    console.log(trackClusters);

    return { trackCentroids, trackClusters };
  };

  const calculateGenreWeights = (selectedGenres) => {
    const featureNames = ['acousticness', 'danceability', 'duration_ms', 'energy', 'instrumentalness', 'liveness', 'loudness', 'speechiness', 'tempo', 'valence'];
    let sumFeatures = {};
    selectedGenres.forEach(genre => {
      featureNames.forEach(feature => {
        if (!sumFeatures[feature]) {
          sumFeatures[feature] = 0;
        }
        sumFeatures[feature] += parseFloat(genre[feature]);
      });
    });
    let avgWeights = {};
    featureNames.forEach(feature => {
      avgWeights[feature] = sumFeatures[feature] / selectedGenres.length;
    });
    return avgWeights;
  };

  const getTracksFromFile = async () => {
    try {
      const response = await fetch(TRACKS_FILE_PATH);
      const text = await response.text();
      const lines = text.split('\n').filter(line => line.trim());
      const tracks = lines.map(line => {
        const parts = line.split(',');
        const id = parts[0];
        const features = parts.slice(1).map(Number);
        return new SimpleTrack(id, features);
      });
      return tracks;
    } catch (error) {
      console.error('Error fetching tracks from file:', error);
      return [];
    }
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

  return {
    getTracksBySearch,
    getClusters
  };
}