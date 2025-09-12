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
        form.append('slug', data.slug);
        form.append('title', data.title);
        form.append('tagLine', data.tagLine);
        form.append('projectScopeDescription', data.projectScopeDescription);

        if (Array.isArray(data.techStack)) {
            form.append('techStack', JSON.stringify(data.techStack));
        } else if (typeof data.techStack === 'string') {
            form.append('techStack', data.techStack);
        }

        if (data.previewImage) form.append('previewImage', data.previewImage);
        if (data.websiteDemo) form.append('websiteDemo', data.websiteDemo);
        if (data.mobileDemo) form.append('mobileDemo', data.mobileDemo);
        if (data.adminPanelImage) form.append('adminPanelImage', data.adminPanelImage);

        const response = await API.post('/portfolio', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updatePortfolio = async (id, data) => {
    try {
        const form = new FormData();
        if (data.slug) form.append('slug', data.slug);
        if (data.title) form.append('title', data.title);
        if (data.tagLine) form.append('tagLine', data.tagLine);
        if (data.projectScopeDescription) form.append('projectScopeDescription', data.projectScopeDescription);

        if (data.techStack) {
            if (Array.isArray(data.techStack)) {
                form.append('techStack', JSON.stringify(data.techStack));
            } else if (typeof data.techStack === 'string') {
                form.append('techStack', data.techStack);
            }
        }

        if (data.previewImage) form.append('previewImage', data.previewImage);
        if (data.websiteDemo) form.append('websiteDemo', data.websiteDemo);
        if (data.mobileDemo) form.append('mobileDemo', data.mobileDemo);
        if (data.adminPanelImage) form.append('adminPanelImage', data.adminPanelImage);

        const response = await API.patch(`/portfolio/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
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


