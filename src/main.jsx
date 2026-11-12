import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/components/Layout.css';
import './styles/pages/Home.css';
import './styles/pages/Dashboard.css';
import './styles/pages/Orders.css';
import './styles/pages/Products.css';
import './styles/pages/Profile.css';
import './styles/pages/Auth.css';
import './styles/treatment.css';
import './styles/responsive.css';

// Mount the React application to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);