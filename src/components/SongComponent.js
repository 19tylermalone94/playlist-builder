import React from 'react';

export default class SongComponent extends React.Component {
  render() {
    const { song } = this.props;

    return (
      <div className="song-container">
        <img src={song.albumArt} alt={`Album art for ${song.title}`} className="song-image" />
        <div>
          <h1 className="song-title">{song.title}</h1>
          <p className="song-artists">Artists: {song.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      </div>
    );
  }
}
