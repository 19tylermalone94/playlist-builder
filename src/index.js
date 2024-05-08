import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SpotifyAuthProvider } from './SpotifyAuthContext';

const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SpotifyAuthProvider client_id={client_id} client_secret={client_secret}>
      <App />
    </SpotifyAuthProvider>
  </React.StrictMode>
);
