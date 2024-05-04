import React from 'react';

export default function SearchTrack({ track, onSelect, onRemove }) {
  const handleClick = () => {
    if (onRemove) {
      onRemove();
    } else {
      onSelect(track);
    }
  };

  // Select the best available image size, typically array is sorted by size
  const albumImageUrl = track.album.images[0]?.url; // Using optional chaining and selecting the first image

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <img src={albumImageUrl} alt={track.album.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
      <div>
        <button onClick={handleClick}>
          {track.name} by {track.artists.map(artist => artist.name).join(", ")}
        </button>
        {onRemove && <button onClick={onRemove} style={{ marginLeft: '10px' }}>Remove</button>}
      </div>
    </div>
  );
}
