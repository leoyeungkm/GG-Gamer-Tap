import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/bootstrap.scss';
import './css/index.css';
import './css/odometer.css';
import "react-toastify/dist/ReactToastify.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import App from './app.js';

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<App />);
