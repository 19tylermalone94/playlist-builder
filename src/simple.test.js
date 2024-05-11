import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import axios from 'axios';
import { useSpotifyService } from './useSpotifyService';

jest.mock('./useSpotifyService');
jest.mock('axios');
jest.mock('papaparse', () => ({
  parse: jest.fn((data, config) => config.complete({
    data: [
      { genres: 'genre1' },
      { genres: 'genre2' },
      { genres: 'genre3' }
    ]
  }))
}));

const mockTracks = [
  { id: 'track1', trackName: 'Song 1', artistName: 'Artist 1' },
  { id: 'track2', trackName: 'Song 2', artistName: 'Artist 2' }
];

describe('App Component Tests', () => {
  beforeEach(() => {
    useSpotifyService.mockReturnValue({
      getTracksBySearch: jest.fn().mockResolvedValue(mockTracks),
      getClusters: jest.fn().mockResolvedValue({ trackClusters: [[mockTracks[0]]] })
    });

    axios.get.mockResolvedValue({
      data: "id1,genre1\nid2,genre2\nid3,genre3"
    });
  });

  test('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/Make a New Playlist/i)).toBeInTheDocument());
  });

  test('clicks "Make a New Playlist" button and opens the search bar', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Make a New Playlist/i));
    await waitFor(() => expect(screen.getByPlaceholderText(/Search for tracks.../i)).toBeInTheDocument());
  });

  test('allows input to be entered in the search bar and triggers a search', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Make a New Playlist/i));
    const input = screen.getByPlaceholderText(/Search for tracks.../i);
    fireEvent.change(input, { target: { value: 'Song' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => expect(screen.getByText('Song 1')).toBeInTheDocument());
  });

  test('displays loading spinner during fetch operation', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Make a New Playlist/i));
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search for tracks.../i);
      fireEvent.change(searchInput, { target: { value: 'Song' } });
      fireEvent.click(screen.getByText('Search'));
    });

    await waitFor(() => {
      screen.debug();
      const track = screen.getByText('Song 1');
      expect(track).toBeInTheDocument();
      fireEvent.click(track);
    });

    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => {
      const genreButton = screen.getByText('genre1');
      fireEvent.click(genreButton);
    });

    fireEvent.click(screen.getByText(/Start Calculations/i));
    await waitFor(() => expect(screen.getByText(/Loading data.../i)).toBeInTheDocument());
});

});
