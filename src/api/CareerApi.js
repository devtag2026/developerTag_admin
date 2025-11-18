import API from "../config/ApiConfig";

export const listCareers = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search && { search })
        });
        const response = await API.get(`/careers?${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createCareer = async (data) => {
    try {
        const response = await API.post('/careers', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateCareer = async (id, data) => {
    try {
        const response = await API.patch(`/careers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getCareerById = async (id) => {
    try {
        const response = await API.get(`/careers/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteCareer = async (id) => {
    try {
        const response = await API.delete(`/careers/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

