import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Falls du diese Datei nutzen willst
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Das "root"-Element muss in der HTML-Datei existieren
);
