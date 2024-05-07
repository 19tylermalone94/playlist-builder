import React, { useState } from 'react';
import SearchBar from './components/SearchBarComponent';  // Make sure this path is correct
import { getSongsBySearch } from './spotifyService';
import './App.css';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const searchResults = await getSongsBySearch(query);
      setSongs(searchResults);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} songs={songs} loading={loading} />
    </div>
  );
};

export default App;
