import axios from 'axios';
import { LoggingMiddleware } from '../../../Logging Middleware/src/LoggingMiddleware';

const API_BASE_URL = 'http://localhost:3000/api';

const logger = new LoggingMiddleware({
  serviceName: 'url-shortener-frontend',
  logLevel: 'info'
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
api.interceptors.request.use(
  (config) => {
    logger.log('info', `API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    logger.log('error', 'API Request Error', { error: error.message });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    logger.log('info', 'API Response', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    logger.log('error', 'API Response Error', {
      error: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const urlService = {
  async shortenUrls(urlsData) {
    try {
      const response = await api.post('/shorten', urlsData);
      return response.data;
    } catch (error) {
      logger.log('error', 'Error shortening URLs', { error: error.message });
      throw error;
    }
  },

  async getStatistics() {
    try {
      const response = await api.get('/statistics');
      return response.data;
    } catch (error) {
      logger.log('error', 'Error fetching statistics', { error: error.message });
      throw error;
    }
  }
};