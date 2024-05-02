import React, { useState } from 'react';
import { fetchTracks, fetchAudioFeatures } from './spotifyService';
import './App.css';
import { useSpotifyAuth } from './useSpotifyAuth';
import TrackList from './components/TrackList';
import AudioFeatures from './components/AudioFeatures'; // Make sure to import the new component

const App = () => {
  const client_id = process.env.REACT_APP_CLIENT_ID;
  const client_secret = process.env.REACT_APP_CLIENT_SECRET;
  const token = useSpotifyAuth(client_id, client_secret);

  const [search, setSearch] = useState('');
  const [tracks, setTracks] = useState([]);
  const [features, setFeatures] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchTracks(search, token);
      setTracks(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching tracks', error);
    }
  };

  const handleTrackSelect = async (trackId) => {
    try {
      const response = await fetchAudioFeatures(trackId, token);
      setFeatures(response.data);
    } catch (error) {
      console.error('Error fetching audio features', error);
    }
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
      <TrackList tracks={tracks} onTrackSelect={handleTrackSelect} />
      {features && <AudioFeatures features={features} />}
    </div>
  );
};

export default App;
