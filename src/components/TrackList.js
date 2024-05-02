import React from 'react';
import TrackItem from './TrackItem'; // Ensure this import is correct

export default function TrackList({ tracks, onTrackSelect }) {
  return (
    <div>
      {tracks.map(track => (
        <TrackItem key={track.id} track={track} onSelect={onTrackSelect} />
      ))}
    </div>
  );
}