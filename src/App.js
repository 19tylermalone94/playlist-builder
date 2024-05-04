import React, { useState } from 'react';
import { fetchTracks, fetchAudioFeatures } from './spotifyService';
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

  const handleStartCalculations = () => {
    console.log("Starting calculations with the following tracks:", selectedTracks);
    // Add your calculation logic here
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
