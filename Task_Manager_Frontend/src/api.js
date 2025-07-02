// Import Axios library to handle HTTP requests
import axios from 'axios';

// Create a pre-configured Axios instance
const api = axios.create({
  // Set the base URL for all API requests.
  // The value comes from your .env file (REACT_APP_API_BASE_URL), 
  // allowing you to easily change API endpoints for different environments (dev/prod).
  baseURL: process.env.REACT_APP_API_BASE_URL,

  // Set default headers: all requests will use JSON content type
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the configured Axios instance so you can import and use it anywhere in your app
export default api;
