import React, { useState } from 'react';
import { fetchTracks, fetchRandomTracks, fetchAudioFeatures } from './spotifyService';
import './App.css';
import { useSpotifyAuth } from './useSpotifyAuth';
import SearchList from './components/SearchList';
import AudioFeatures from './components/AudioFeatures';
import SearchTrack from './components/SearchTrack';

const App = () => {
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const client_secret = process.env.REACT_APP_CLIENT_SECRET;
  const token = useSpotifyAuth(client_id, client_secret);

  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [features, setFeatures] = useState(null);
  const [selectedTracks, setSelectedTracks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchTracks(search, token);
      setTracks(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching tracks', error);
    }
  };

  const handleTrackSelect = (track) => {
    if (selectedTracks.length >= 5) {
      alert('You can only select up to 5 songs.');
      return;
    }
    setSelectedTracks(prev => [...prev, track]);
  };

  const handleRemoveTrack = (trackId) => {
    setSelectedTracks(prev => prev.filter(t => t.id !== trackId));
  };

  const handleStartCalculations = async () => {
    console.log("Fetching 100 random tracks for analysis...");
    const randomTracks = await fetchRandomTracks(token);
    if (randomTracks.length > 0) {
      console.log("Normalizing features...");
      const allFeatures = await fetchAndNormalizeFeatures(randomTracks, token);
      const selectedFeatures = await fetchAndNormalizeFeatures(selectedTracks, token);
      console.log("Performing K-means clustering...");
      const clusters = await kMeansClustering(selectedFeatures, allFeatures);
      console.log("Clusters formed:", clusters);
    } else {
      console.log("No tracks fetched.");
    }
  };

  const fetchAndNormalizeFeatures = async (tracks, token) => {
    const features = [];
    for (const track of tracks) {
      if (!track.id) continue;
      try {
        const response = await fetchAudioFeatures(track.id, token);
        features.push(response.data);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'] ? parseInt(error.response.headers['retry-after']) : 10;
          console.log(`Rate limit hit, retrying after ${retryAfter} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        } else {
          console.error('Error fetching audio features for track ID:', track.id, error);
        }
      }
    }
    return normalizeFeatures(features);
  };

  const kMeansClustering = (selectedFeatures, allFeatures, iterations = 10) => {
    let centroids = selectedFeatures.slice(0, 5);
    let clusters = [];

    for (let it = 0; it < iterations; it++) {
      clusters = centroids.map(() => []);
      allFeatures.forEach((feature, index) => {
        const distances = centroids.map(centroid =>
          Math.sqrt(Object.keys(centroid).reduce((sum, key) => sum + Math.pow((centroid[key] - feature[key]), 2), 0))
        );
        const closestCentroidIndex = distances.indexOf(Math.min(...distances));
        clusters[closestCentroidIndex].push({ index, feature });
      });

      centroids = clusters.map(cluster => {
        const centroid = {};
        const keys = Object.keys(cluster[0].feature);
        keys.forEach(key => {
          centroid[key] = cluster.reduce((sum, obj) => sum + obj.feature[key], 0) / cluster.length;
        });
        return centroid;
      });
    }

    return clusters.map(cluster => cluster.slice(0, 5).map(obj => tracks[obj.index])); // Assumes tracks array is accessible
  };

  const normalizeFeatures = (features) => {
    if (!features.length) return [];
    const featureKeys = Object.keys(features[0]);
    const means = {};
    const stdDevs = {};

    featureKeys.forEach(key => {
      const values = features.map(f => f[key]).filter(v => !isNaN(v));
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.map(v => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length);
      means[key] = mean;
      stdDevs[key] = stdDev;
    });

    return features.map(feature => {
      const normalized = {};
      featureKeys.forEach(key => {
        const value = feature[key];
        normalized[key] = isNaN(value) ? 0 : (value - means[key]) / stdDevs[key];
        normalized[key] = isNaN(normalized[key]) ? 0 : normalized[key];
      });
      return normalized;
    });
  };

  return (
    <div>
      <h1>Spotify Audio Features</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search for a song"
        />
        <button type="submit">Search</button>
      </form>
      <SearchList tracks={tracks} onTrackSelect={handleTrackSelect} />
      {features && <AudioFeatures features={features} />}
      <div>
        <h2>Selected Songs</h2>
        {selectedTracks.map(track => (
          <SearchTrack key={track.id} track={track} onSelect={() => handleRemoveTrack(track.id)} />
        ))}
      </div>
      {selectedTracks.length === 5 && (
        <button onClick={handleStartCalculations} style={{ marginTop: '20px' }}>
          Start
        </button>
      )}
    </div>
  );
};

export default App;
