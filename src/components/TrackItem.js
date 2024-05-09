import React, { useState } from 'react';

const TrackItem = ({ track, onClick, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const itemStyle = isSelected ? { backgroundColor: '#88864d' } : {};

  // Toggle play/pause for preview
  const handlePlayPause = (event) => {
    event.stopPropagation(); // Prevent the onClick event from firing when the button is clicked
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="trackItem" onClick={onClick} style={itemStyle}>
      <img src={track.albumArtUrl} alt={`Cover art for ${track.trackName}`} className="albumArt" />
      <div className="textContainer">
        <h3 className="trackName">{track.trackName}</h3>
        <p className="artistName">{track.artistName}</p>
      </div>
      {track.previewUrl && (
        <button onClick={handlePlayPause} className="playPauseButton">
          {isPlaying ? '||' : '►'}
        </button>
      )}
      {isPlaying && (
        <audio src={track.previewUrl} autoPlay onEnded={() => setIsPlaying(false)}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default TrackItem;
