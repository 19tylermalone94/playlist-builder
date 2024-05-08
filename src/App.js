import React, { useState } from 'react';
import { useSpotifyService } from './useSpotifyService';
import TrackItem from './components/TrackItem';
import './App.css'

const App = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTracksBySearch } = useSpotifyService();

  const handleNewPlaylist = () => {
      setIsSearching(true); // Show the search bar
  };

  const handleSearch = async () => {
      if (searchQuery) {
          const tracks = await getTracksBySearch(searchQuery);
          setSearchResults(tracks);
      }
  };

  const handleQueryChange = (event) => {
      setSearchQuery(event.target.value);
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
        {searchResults.map((track, index) => (
          <TrackItem key={index} track={track} />
        ))}
      </div>
    </div>
  );
};

export default App;
