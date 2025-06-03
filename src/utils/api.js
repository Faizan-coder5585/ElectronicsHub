import axios from 'axios';

// Create Axios instance
const API = axios.create({
  baseURL: process.env.BACKEND_API_URL, // Example: 'http://localhost:5000/api'
});


export default API;
