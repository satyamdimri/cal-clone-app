import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({ 
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;