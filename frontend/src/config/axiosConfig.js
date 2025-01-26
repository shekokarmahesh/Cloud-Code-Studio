import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

export default axiosInstance;

//there are 2 methods to make http requests in react
//1. fetch api (built in browser) 
//2. axios (3rd party library)
