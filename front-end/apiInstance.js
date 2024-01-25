// apiInstance.js

import axios from 'axios';
import API_CONFIG from './apiConfig';

const apiInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000,
});

export default apiInstance;
