import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App component tests', () => {
  test('Clicking the "Return" button calls handleHome and resets the app', () => {
    render(<App />);

    // Assume your app starts in a state where the "Return" button might not be immediately visible
    // We need to navigate or trigger state changes that would make the "Return" button appear
    // For simplicity, let's assume it's always visible for the purpose of this test

    const returnButton = screen.getByRole('button', { name: /return/i });
    fireEvent.click(returnButton);

    // Now check if it has called handleHome and reset the app state
    // You might need to check specific state changes, for example:
    expect(screen.getByText(/Make a New Playlist/i)).toBeInTheDocument();
    // This assumes that after clicking 'Return', your app shows a "Make a New Playlist" button
  });
});
