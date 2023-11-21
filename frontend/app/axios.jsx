import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const axios_instance = axios.create({
    baseURL: '/api',
});

export default axios_instance;
