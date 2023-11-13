import axios from 'axios';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const axios_instance = axios.create({
    baseURL: publicRuntimeConfig.backendUrl,
    headers:{
        "Access-Control-Allow-Origin":"*"
    }
});

export default axios_instance;
