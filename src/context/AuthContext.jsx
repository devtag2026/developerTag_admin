"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { loginUser, signupUser, logoutUser, refreshAccessToken } from '../api/AuthApi';
import { changePassword, getCurrentUser, updateAccount, updateAvatar } from '../api/UserApi';

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true, isLoading: false, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'LOGOUT':
            return { ...initialState };
        default:
            return state;
    }
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        if (storedUser && accessToken) {
            try {
                const user = JSON.parse(storedUser);
                dispatch({ type: 'SET_USER', payload: user });
            } catch (e) {
                localStorage.clear();
            }
        }
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const user = await loginUser(credentials);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
            throw error;
        }
    };

    const signup = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const user = await signupUser(userData);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Signup failed' });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const fetchCurrentUser = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await getCurrentUser();
            const userData = response.data;
            const user = { ...userData, id: userData._id };
            dispatch({ type: 'SET_USER', payload: user });
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch user' });
        }
    };

    const changeUserPassword = async (passwordData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await changePassword(passwordData);
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Password change failed' });
            throw error;
        }
    };

    const updateUserAccount = async (accountData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await updateAccount(accountData);
            const userData = response.data;
            const user = { ...userData, id: userData._id };
            dispatch({ type: 'SET_USER', payload: user });
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Account update failed' });
            throw error;
        }
    };

    const updateUserAvatar = async (avatarFile) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await updateAvatar(avatarFile);
            const userData = response.data;
            const user = { ...userData, id: userData._id };
            dispatch({ type: 'SET_USER', payload: user });
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Avatar update failed' });
            throw error;
        }
    };

    const refreshToken = async () => {
        try {
            await refreshAccessToken();
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Token refresh failed' });
            throw error;
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <AuthContext.Provider value={{
            state,
            login,
            signup,
            logout,
            getCurrentUser: fetchCurrentUser,
            changePassword: changeUserPassword,
            updateAccount: updateUserAccount,
            updateAvatar: updateUserAvatar,
            refreshToken,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};


