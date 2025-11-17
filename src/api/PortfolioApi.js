import API from "../config/ApiConfig";

export const listPortfolios = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search && { search })
        });
        const response = await API.get(`/portfolio?${query}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPortfolio = async (data) => {
    try {
        const form = new FormData();
        form.append('name', data.name);
        form.append('description', data.description);
        form.append('cost', data.cost);
        form.append('url', data.url);
        form.append('category', data.category);
        form.append('featured', String(data.featured || false));
        form.append('displayOrder', String(data.displayOrder || 0));

        // Handle image - only file uploads
        if (data.image && data.image instanceof File) {
            form.append('image', data.image);
        }

        const response = await API.post('/portfolio', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updatePortfolio = async (id, data) => {
    try {
        const form = new FormData();
        if (data.name) form.append('name', data.name);
        if (data.description) form.append('description', data.description);
        if (data.cost) form.append('cost', data.cost);
        if (data.url) form.append('url', data.url);
        if (data.category) form.append('category', data.category);
        if (data.featured !== undefined) form.append('featured', String(data.featured));
        if (data.displayOrder !== undefined) form.append('displayOrder', String(data.displayOrder));

        // Handle image - only file uploads
        if (data.image && data.image instanceof File) {
            form.append('image', data.image);
        }

        const response = await API.patch(`/portfolio/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPortfolioById = async (id) => {
    try {
        const response = await API.get(`/portfolio/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deletePortfolio = async (id) => {
    try {
        const response = await API.delete(`/portfolio/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


