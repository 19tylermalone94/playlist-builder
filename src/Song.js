export default class Song {
  constructor(title, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, tempo, valence, albumArt, artists) {
    this.title = title;
    this.acousticness = acousticness;
    this.danceability = danceability;
    this.energy = energy;
    this.instrumentalness = instrumentalness;
    this.liveness = liveness;
    this.loudness = loudness;
    this.speechiness = speechiness;
    this.tempo = tempo;
    this.valence = valence;
    this.albumArt = albumArt;
    this.artists = artists;

    this.features = [
      this.acousticness,
      this.danceability,
      this.energy,
      this.instrumentalness,
      this.liveness,
      this.loudness,
      this.speechiness,
      this.tempo,
      this.valence
    ];
  }

  toHTML() {
    const featureList = this.features.map((feature, index) => `<li>${Object.keys(this)[index + 1]}: ${feature}</li>`).join('');
    return `<h1>${this.title}</h1><img src="${this.albumArt}" alt="Album art for ${this.title}"><ul>${featureList}</ul>`;
  }
}
