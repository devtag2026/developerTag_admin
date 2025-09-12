import API from "../config/ApiConfig";

export const listTestimonials = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search && { search })
        });
        const response = await API.get(`/testimonials?${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createTestimonial = async (data) => {
    try {
        const form = new FormData();
        form.append('content', data.content);
        form.append('name', data.name);
        form.append('title', data.title);
        if (data.testimonialImg) form.append('testimonialImg', data.testimonialImg);
        const response = await API.post('/testimonials', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateTestimonial = async (id, data) => {
    try {
        const form = new FormData();
        if (data.content) form.append('content', data.content);
        if (data.name) form.append('name', data.name);
        if (data.title) form.append('title', data.title);
        if (data.testimonialImg) form.append('testimonialImg', data.testimonialImg);
        const response = await API.patch(`/testimonials/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
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
        const response = await API.patch(`/testimonials/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


