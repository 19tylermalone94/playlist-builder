# playlist-builder

## Overview

Watch demo here: [![Watch the Video](https://i.ytimg.com/an_webp/D6Kzif93vKo/mqdefault_6s.webp?du=3000&sqp=CL70-7EG&rs=AOn4CLA9D74tSwv72Wulr0_8C5GRxdI6Dw)](https://www.youtube.com/watch?v=D6Kzif93vKo)

After selecting some of your favorite tracks and genres, this app then uses a Kmeans Clustering algorithm to calculate recommendations for new songs.

## Motivation
Over the course of Spring semester 2024, we built upon an idea that involved performing similarity calculations, predictions, and clustering, all using information from songs and their user ratings.
I decided that it would be appropriate to remain with and expand upon that idea, especially since I feel I have spent the semester preparing for this. Using the Spotify API to retrieve track information and audio features, I have created a very simple playlist-builder/song discovery web app.

## Task
* get user selections (tracks and genres)
* get the feature arrays for the selected tracks, and average the feature array for genre.
* read in the 114,000 tracks from the dataset.
* normalize all features using min-mix normalization.
* normalize the genre feature array such that the sum of its elements is 0. This will serve as the weight vector.
* using the track dataset, selected tracks as inital centroids, and weight vector made from genre selections, perform Kmeans Clustering.
* return the 10 closest tracks to the centroid for each cluster.

## How to use
The app is currently hosted at: https://playlist-builder-rust.vercel.app/

  * search and select up to 5 tracks
  * search and select up to 5 genres
  * begin calculations and view results

### Credits

  * The 114,000 track IDs used for random song selection are from this dataset: https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset
  * The `data_by_genre.csv` dataset was adapted from this dataset: https://www.kaggle.com/datasets/pesssinaluca/spotify-by-generes
