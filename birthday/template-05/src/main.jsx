import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import MobileGate from './mobile/MobileGate.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MobileGate>
      <App />
    </MobileGate>
  </React.StrictMode>
);
