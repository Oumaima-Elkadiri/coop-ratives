import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; 
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Enveloppez l'application avec BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);