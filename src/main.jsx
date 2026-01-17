import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Global Styles (Tailwind + Custom Animations)
import './styles/index.css';
import './styles/animations.css';

// Import Phosphor Icons Weights
// These imports enable the class names like 'ph-bold', 'ph-fill', etc.
import "@phosphor-icons/web/bold";
import "@phosphor-icons/web/fill";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/duotone"; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);