import React, { useState } from 'react';
import { useSpotifyService } from './useSpotifyService';
import TrackItem from './components/TrackItem';
import './App.css';

const App = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const { getTracksBySearch } = useSpotifyService();

  const handleNewPlaylist = () => {
    setIsSearching(true); // Show the search bar
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const tracks = await getTracksBySearch(searchQuery);
      console.log("Tracks returned from search:", tracks); // Check the structure here
      setSearchResults(tracks);
    }
  };

  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleTrackSelection = (track) => {
    console.log("Toggling track:", track.id);
    const isAlreadySelected = selectedTracks.some(t => t.id === track.id);
    console.log("Is already selected:", isAlreadySelected);
    if (isAlreadySelected) {
      const newSelection = selectedTracks.filter(t => t.id !== track.id);
      console.log("New selection after removal:", newSelection.map(t => t.id));
      setSelectedTracks(newSelection);
    } else {
      if (selectedTracks.length < 5) {
        const newSelection = [...selectedTracks, track];
        console.log("New selection after adding:", newSelection.map(t => t.id));
        setSelectedTracks(newSelection);
      } else {
        alert('You can only select up to 5 tracks.');
      }
    }
  };
  

  const handleStartCalculations = () => {
    console.log("Starting calculations with these tracks:", selectedTracks);
    // Implement calculation logic or API calls here
  };

  return (
    <div className="App">
      <button onClick={handleNewPlaylist}>Make a New Playlist</button>
      {isSearching && (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleQueryChange}
            placeholder="Search for tracks..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}

      <div className="search-results">
        {searchResults.map((track) => (
          <TrackItem key={track.id} track={track} onClick={() => toggleTrackSelection(track)} isSelected={selectedTracks.includes(track)} />
        ))}
      </div>

      {selectedTracks.length > 0 && (
        <div className="dropdown">
          <ul>
            {selectedTracks.map(track => (
              <li key={track.id}>{track.trackName} - {track.artistName}</li>
            ))}
          </ul>
          <button onClick={handleStartCalculations}>Start Calculations</button>
        </div>
      )}
    </div>
  );
};

export default App;
