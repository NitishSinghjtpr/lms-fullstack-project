import axios from 'axios';

const BASE_URL="https://lms-fullstack-project-1.onrender.com";

const axiosInstance=axios.create();

axiosInstance.defaults.baseURL=BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance; 