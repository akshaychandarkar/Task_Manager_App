import React from 'react';  // React library to use JSX and React features.
import ReactDOM from 'react-dom/client';  //  ReactDOM to mount the React app.
import App from './App'; // the root component of the app
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Creating the root element (public, index.html)
root.render(<App />);  // Rendering the root App component into the root DOM node.
