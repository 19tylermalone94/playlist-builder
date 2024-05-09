import React, { useState } from 'react';

const TrackItem = ({ track, onClick, isSelected }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const itemStyle = isSelected ? { backgroundColor: '#88864d' } : {};

  const handlePlayPause = (event) => {
    event.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleMouseMove = (event) => {
    setPopupPosition({
      top: event.clientY + 10, // Offset by 10px from the cursor
      left: event.clientX + 10
    });
  };

  // Conditional class for animation
  const animationClass = isPlaying ? 'trackItem pulsing' : 'trackItem';

  return (
    <div className={animationClass} onClick={onClick} onMouseMove={handleMouseMove} style={itemStyle}>
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
      <div className="featurePopup" style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}>
        <ul>
          <li>Acousticness: {Number(track.features[0]).toFixed(2)}</li>
          <li>Danceability: {Number(track.features[1]).toFixed(2)}</li>
          <li>Duration: {Number(track.features[2]).toFixed(2)} ms</li>
          <li>Energy: {Number(track.features[3]).toFixed(2)}</li>
          <li>Instrumentalness: {Number(track.features[4]).toFixed(2)}</li>
          <li>Liveness: {Number(track.features[5]).toFixed(2)}</li>
          <li>Loudness: {Number(track.features[6]).toFixed(2)} dB</li>
          <li>Speechiness: {Number(track.features[7]).toFixed(2)}</li>
          <li>Tempo: {Number(track.features[8]).toFixed(2)} BPM</li>
          <li>Valence: {Number(track.features[9]).toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackItem;
