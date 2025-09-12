import API from "../config/ApiConfig";

// Save tokens & user in localStorage
const saveUserSession = (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
};

// Remove tokens & user from localStorage
const clearUserSession = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

// Login API
export const loginUser = async (credentials) => {
    try {
        const response = await API.post("/users/login", credentials);
        console.log("Full API response from login:", response.data);

        const userData = response.data.data.user || response.data.data;
        const { accessToken, refreshToken } = response.data.data;

        const user = {
            ...userData,
            id: userData._id,
        };

        if (!user) {
            console.error("No user returned in login response.");
        }

        // Frontend validation: only allow admins to sign in
        const userRole = user && (user.role || userData?.role);
        if (userRole && String(userRole).toLowerCase() !== "admin") {
            throw { message: "Only admin can sign in" };
        }

        saveUserSession(user, accessToken, refreshToken);
        return user;
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Signup API
export const signupUser = async (userData) => {
    try {
        const response = await API.post("/users/register", userData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Signup response:", response.data);

        const userResponseData = response.data.data;
        const user = {
            ...userResponseData,
            id: userResponseData._id,
        };

        // Note: Register endpoint might not return tokens, you may need to login after
        if (response.data.data.accessToken && response.data.data.refreshToken) {
            saveUserSession(user, response.data.data.accessToken, response.data.data.refreshToken);
        }

        return user;
    } catch (error) {
        console.error("Signup Error:", error.response?.data || error.message);
        throw error;
    }
};

// Logout API
export const logoutUser = async () => {
    try {
        await API.post("/users/logout");
        clearUserSession();
    } catch (error) {
        clearUserSession();
        console.error("Error logging out:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Refresh Token API
export const refreshAccessToken = async () => {
    try {
        const response = await API.post("/users/refresh-token");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


