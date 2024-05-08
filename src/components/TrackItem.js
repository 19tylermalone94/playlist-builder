import React from 'react';

const TrackItem = ({ track }) => {
  return (
    <div className="trackItem">
      <img src={track.albumArtUrl} alt={`Cover art for ${track.trackName}`} className="albumArt" />
      <div className="textContainer">
        <h3 className="trackName">{track.trackName}</h3>
        <p className="artistName">{track.artistName}</p>
      </div>
    </div>
  );
};

export default TrackItem;
