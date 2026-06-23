import API from '../config/ApiConfig';

export const fetchFormSubmissions = async (params = {}) => {
    const { page = 1, limit = 10, search = '', type = '' } = params;
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(type && { type }),
    });

    const response = await API.get(`/forms?${queryParams}`);
    return response.data;
};

export const createFromSubmission = async (mode, payload) => {
    const endpoint = mode === 'proposal' ? '/proposals' : '/contracts';
    const response = await API.post(endpoint, payload);
    return response.data;
};
