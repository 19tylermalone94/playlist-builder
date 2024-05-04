import React from 'react';
import SearchTrack from './SearchTrack'; // Ensure this import is correct

export default function SearchList({ tracks, onTrackSelect }) {
  return (
    <div>
      {tracks.map(track => (
        <SearchTrack key={track.id} track={track} onSelect={onTrackSelect} />
      ))}
    </div>
  );
}