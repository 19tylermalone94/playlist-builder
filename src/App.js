import React, { useState, useEffect } from 'react';
import { useSpotifyService } from './useSpotifyService';
import TrackItem from './components/TrackItem';
import axios from 'axios';
import Papa from 'papaparse';
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isSearchingGenre, setIsSearchingGenre] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('/data_by_genres.csv');
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            setGenres(results.data);
          }
        });
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreQueryChange = (event) => {
    setSearchQuery(event.target.value)
    const search = event.target.value.toLowerCase();
    const filtered = genres.filter(genre => genre.genres.toLowerCase().includes(search));
    setFilteredGenres(filtered);
  };

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);


  const toggleFeaturesVisibility = () => {
    setShowFeatures(prev => !prev);
  };

  const handleHome = () => {
    setIsHome(true);
    setIsSearching(false);
    setSearchResults([]);
    setSearchQuery('');
    setSelectedTracks([]);
    setSelectedGenres([]);
    setClusters([]);
    setIsLoading(false);
    setIsSearchingGenre(false);
  };

  const handleNewPlaylist = () => {
    setIsHome(false);
    setIsSearching(true);
    setSelectedTracks([]);
    setSelectedGenres([]);
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

  const handleGenreSelection = () => {
    setIsSearching(false);  // Hide track search
    setSearchQuery('');
    setIsSearchingGenre(true);  // Enable genre search
  };

  const selectGenre = (genre) => {
    const isAlreadySelected = selectedGenres.some(g => g.genres === genre.genres);
    console.log("Is already selected:", isAlreadySelected);
    if (isAlreadySelected) {
      const newSelection = selectedGenres.filter(t => t.genres !== genre.genres);
      console.log("New selection after removal:", newSelection.map(t => t.genres));
      setSelectedGenres(newSelection);
    } else {
      if (selectedGenres.length < 5) {
        const newSelection = [...selectedGenres, genre];
        console.log("New selection after adding:", newSelection.map(t => t.genres));
        setSelectedGenres(newSelection);
      } else {
        alert('You can only select up to 5 genres.');
      }
    }
  };
  
  const handleStartCalculations = async () => {
    if (selectedGenres.length === 0) {
      alert('Please select at least one genre.');
      return;
    }
    setIsSearchingGenre(false);
    setIsLoading(true);
    try {
      const result = await getClusters(selectedTracks.map(track => track.id), selectedGenres);
      setClusters(result.trackClusters);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in starting calculations:", error);
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="App">
      <button onClick={toggleFeaturesVisibility}>
          {showFeatures ? 'Hide Features' : 'Show Features'}
      </button>

      <div className='header'>
        <img src='/logo_raw.png' alt='builder_logo'/>
        <h1 className='title'>Playlist Builder</h1>
        <img src='/logo_raw.png' alt='builder_logo'/>
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
        <div className='searchProcess'>
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
            <ul className='searchItem'>
              {searchResults.map(track => (
                <TrackItem key={track.id} track={track} onClick={() => toggleTrackSelection(track)} isSelected={selectedTracks.includes(track)} showFeatures={showFeatures} />
              ))}
            </ul>
          </div>
        </div>
      )}

      {isSearching && selectedTracks.length > 0 && clusters.length === 0 && (
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
          <button onClick={handleGenreSelection}>Next</button>
        </div>
      )}

      {isSearchingGenre && (
        <div>
          <div className='searchBar'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleGenreQueryChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder="Search for genres..."
            />
          </div>
          <div className='genreResults'>
            {filteredGenres.map((genre, index) => (
              <div className={`genreItem ${selectedGenres.some(g => g.genres === genre.genres) ? 'selected' : ''}`}
                  key={index}
                  onClick={() => selectGenre(genre)}>
                {genre.genres}
              </div>
            ))}
          </div>
        </div>
      )}

      {isSearchingGenre && selectedGenres.length > 0 && clusters.length === 0 && (
        <div className="dropdown">
          <button onClick={toggleDropdown}>
            {isDropdownVisible ? '▼ Hide' : '▲ Show'}
          </button>
          {isDropdownVisible && (
            <div className='genreResults'>
              {selectedGenres.map((genre, index) => (
                <div className='genreItem' key={index} onClick={() => selectGenre(genre)}>
                  {genre.genres}
                </div>
              ))}
            </div>
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
                  <TrackItem key={track.id} track={track} showFeatures={showFeatures}/>
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