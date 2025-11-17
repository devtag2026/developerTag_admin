import axios from "axios";

// Create an Axios instance
const API = axios.create({
    baseURL: "https://developer-tag-backend-wz59.vercel.app/api/v1", // Adjust the base URL if necessary
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default API;