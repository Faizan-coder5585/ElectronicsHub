import axios from 'axios';

const API = axios.create({
  baseURL: process.env.BACKEND_API_URL,
});

export default API;
