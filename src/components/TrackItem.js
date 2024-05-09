import React from 'react';

const TrackItem = ({ track, onClick, isSelected }) => {
  const itemStyle = isSelected ? { backgroundColor: '#88864d' } : {};
  return (
    <div className="trackItem" onClick={onClick} style={itemStyle}>
      <img src={track.albumArtUrl} alt={`Cover art for ${track.trackName}`} className="albumArt" />
      <div className="textContainer">
        <h3 className="trackName">{track.trackName}</h3>
        <p className="artistName">{track.artistName}</p>
      </div>
    </div>
  );
};

export default TrackItem;
