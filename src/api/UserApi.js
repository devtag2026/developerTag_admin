import API from "../config/ApiConfig";

export const changePassword = async (passwordData) => {
    try {
        const response = await API.post("/users/change-password", passwordData);
        return response.data;
    } catch (error) {
        console.error(
            "Error changing password:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await API.get("/users/current-user");
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching current user:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

export const updateAccount = async (accountData) => {
    try {
        const response = await API.patch("/users/update-account", accountData);
        return response.data;
    } catch (error) {
        console.error(
            "Error updating account details:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};

// For updating user avatar (requires authentication and file upload)
export const updateAvatar = async (avatarFile) => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatarFile); // Use exact field name 'avatar'

        const response = await API.patch("/users/update-avatar", formData, {
            headers: {
                // Explicitly remove Content-Type to let browser set it automatically for FormData
                // This ensures multipart/form-data with proper boundary
                'Content-Type': undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error(
            "Error updating avatar:",
            error.response?.data?.message || error.message
        );
        throw error.response?.data || error;
    }
};


