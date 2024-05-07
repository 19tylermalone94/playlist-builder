import React, { useState } from 'react';
import { getSongsBySearch } from '../spotifyService';
import SongComponent from './SongComponent';

const SearchBar = ({ onSearch, songs, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent the default form submission
    onSearch(searchTerm);  // Trigger the search using the parent component's function
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for songs"
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <h1>Songs</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {songs.map((song, index) => (
            <SongComponent key={index} song={song} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
