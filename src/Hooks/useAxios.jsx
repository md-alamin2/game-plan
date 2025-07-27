import React from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://assignment-12-server-gray-six.vercel.app/"
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;