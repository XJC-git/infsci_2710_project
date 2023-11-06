import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const axios_instance = axios.create({
    baseURL: publicRuntimeConfig.backendUrl,
});

export default axios_instance;