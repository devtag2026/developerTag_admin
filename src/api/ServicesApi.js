import API from "../config/ApiConfig";

export const listServices = async (params = {}) => {
    try {
        const { page = 1, limit = 10, search = '' } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search })
        });

        const response = await API.get(`/services?${queryParams}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching services:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const createService = async (serviceData) => {
    try {
        const formData = new FormData();
        formData.append('title', serviceData.title);
        formData.append('slug', serviceData.slug);
        formData.append('description', serviceData.description);
        formData.append('category', serviceData.category);
        
        // Handle image - only file uploads
        if (serviceData.heroImage && serviceData.heroImage instanceof File) {
            formData.append('heroImage', serviceData.heroImage);
        }
        
        if (serviceData.whyChooseSection) {
            formData.append('whyChooseSection', JSON.stringify(serviceData.whyChooseSection));
        }

        const response = await API.post("/services", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error creating service:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const updateService = async (id, serviceData) => {
    try {
        const formData = new FormData();

        if (serviceData.title) formData.append('title', serviceData.title);
        if (serviceData.slug) formData.append('slug', serviceData.slug);
        if (serviceData.description) formData.append('description', serviceData.description);
        if (serviceData.category) formData.append('category', serviceData.category);
        
        // Handle image - only file uploads
        if (serviceData.heroImage && serviceData.heroImage instanceof File) {
            formData.append('heroImage', serviceData.heroImage);
        }
        
        if (serviceData.whyChooseSection) {
            formData.append('whyChooseSection', JSON.stringify(serviceData.whyChooseSection));
        }

        const response = await API.patch(`/services/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error updating service:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const deleteService = async (id) => {
    try {
        const response = await API.delete(`/services/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error deleting service:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const getServiceById = async (id) => {
    try {
        const response = await API.get(`/services/${id}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching service:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};