import React from 'react';

export default function TrackItem({ track, onSelect }) {
  return (
    <button onClick={() => onSelect(track.id)}>
      {track.name} by {track.artists.map(artist => artist.name).join(", ")}
    </button>
  );
}