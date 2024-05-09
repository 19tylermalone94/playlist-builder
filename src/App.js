import React, { useState, useEffect } from 'react';
import { useSpotifyService } from './useSpotifyService';
import TrackItem from './components/TrackItem';
import './App.css';

const messages = [
  "Loading data...",
  "Normalizing Features...",
  "Clustering...",
  "Almost there..."
];

const App = () => {
  const [isHome, setIsHome] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const { getTracksBySearch, getClusters } = useSpotifyService();
  const [clusters, setClusters] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 3000); // Change message every 3 seconds

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [isLoading]);


  const handleHome = () => {
    setIsHome(true);
    setIsSearching(false);
    setSearchResults([]);
    setSearchQuery('');
    setSelectedTracks([]);
    setClusters([]);
    setIsLoading(false);
  };

  const handleNewPlaylist = () => {
    setIsHome(false);
    setIsSearching(true);
    setSelectedTracks([]);
    setClusters([]);
    setIsLoading(false);
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

  const handleStartCalculations = async () => {
    console.log("Starting calculations with these tracks:", selectedTracks);
    setIsSearching(false);
    setIsLoading(true);
    try {
      const result = await getClusters(selectedTracks.map(track => track.id));
      console.log("Cluster results:", result);
      setClusters(result.trackClusters);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in starting calculations:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="App">
      <div className='header' >
        <img src="/logo_raw.png" alt="Home" />
        <h1 className='title'>Playlist Builder</h1>
        <img src="/logo_raw.png" alt="Home" />
      </div>
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-message">{messages[currentMessage]}</div>
        </div>
      )}
      {isHome && (
        <div className='makePlaylist'>
          <button onClick={handleNewPlaylist}>Make a New Playlist</button>
        </div>
      )}
      {isSearching && (
        <div>
          <div className='searchBar'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleQueryChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search for tracks..."
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <div className={`search-results ${searchResults.length > 0 ? 'show' : ''}`}>
            {searchResults.map((track) => (
            <ul>
              <TrackItem key={track.id} track={track} onClick={() => toggleTrackSelection(track)} isSelected={selectedTracks.includes(track)} />
            </ul>
            ))}
          </div>
        </div>
      )}

      {selectedTracks.length > 0 && clusters.length === 0 && (
        <div className="dropdown">
        <button onClick={toggleDropdown}>
          {isDropdownVisible ? '▼ Hide' : '▲ Show'}
        </button>
        {isDropdownVisible && (
          <ul>
            {selectedTracks.map(track => (
              <TrackItem key={track.id} track={track} onClick={() => toggleTrackSelection(track)} />
            ))}
          </ul>
        )}
        <button onClick={handleStartCalculations}>Start Calculations</button>
      </div>
      )}

      {clusters.length > 0 && (
      <div className='cluster-results-container'>
        <button className='returnButton' onClick={handleHome}>Return</button>
        {clusters.map((cluster, index) => (
          <div key={index} className="cluster-results">
            <h2>Playlist inspiration: {selectedTracks[index].trackName}, by {selectedTracks[index].artistName}</h2>
            <ul>
              {cluster.map(track => (
                <TrackItem key={track.id} track={track} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
      <div className='footer'>
      <img src="/spotify.jpeg" alt="spotify_icon" />
        <h2>Powered by Spotify's API</h2>
        <img src="/spotify.jpeg" alt="spotify_icon" />
      </div>
    </div>
  );

};

export default App;