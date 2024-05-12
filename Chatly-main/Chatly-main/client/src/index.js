import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider, authReducer, initialState } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider reducer={authReducer} initialState={initialState}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);