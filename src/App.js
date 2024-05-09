import React, { useState } from 'react';
import { useSpotifyService } from './useSpotifyService';
import TrackItem from './components/TrackItem';
import './App.css';

const App = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const { getTracksBySearch, getClusters } = useSpotifyService();
  const [clusters, setClusters] = useState([]);

  const handleNewPlaylist = () => {
    setIsSearching(true);
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
    try {
      const result = await getClusters(selectedTracks.map(track => track.id));
      console.log("Cluster results:", result);
      setClusters(result.clusters); // Assuming result.clusters is an array of cluster objects
    } catch (error) {
      console.error("Error in starting calculations:", error);
    }
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
              <TrackItem key={track.id} track={track} />
            ))}
          </ul>
          <button onClick={handleStartCalculations}>Start Calculations</button>
        </div>
      )}

      {clusters.map((cluster, index) => (
        <div key={index} className="cluster-results">
          <h2>Songs similar to {selectedTracks[index].trackName}</h2>
          <ul>
            {cluster.map(track => (
              // <li key={track.id}>{track.trackName} - {track.artistName}</li>
              <TrackItem key={track.id} track={track} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

};

export default App;
