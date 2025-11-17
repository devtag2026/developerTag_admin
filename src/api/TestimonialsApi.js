import API from "../config/ApiConfig";

export const listTestimonials = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search && { search })
        });
        const response = await API.get(`/testimonials/all-testimonial?${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createTestimonial = async (data) => {
    try {
        const response = await API.post('/testimonials', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateTestimonial = async (id, data) => {
    try {
        const response = await API.patch(`/testimonials/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteTestimonial = async (id) => {
    try {
        const response = await API.delete(`/testimonials/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getTestimonialById = async (id) => {
    try {
        const response = await API.get(`/testimonials/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


