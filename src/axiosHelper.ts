import axios2 from 'axios';
import { getData } from './storageHelper';

const axios = axios2.create({
  baseURL: 'https://kashif.futuredevsolutions.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.request.use(
  async config => {
    config.headers['Cookie'] = await getData('sessionCookies');
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(response => response);

export default axios;
