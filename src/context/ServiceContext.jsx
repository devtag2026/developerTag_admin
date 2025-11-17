"use client";
import React, { createContext, useContext, useReducer } from 'react';
import { listServices, createService, updateService, deleteService, getServiceById } from '../api/ServicesApi';

const initialState = {
    services: [],
    pagination: null,
    currentService: null,
    isLoading: false,
    error: null,
    searchQuery: '',
};

const serviceReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SERVICES':
            return {
                ...state,
                services: action.payload.items,
                pagination: action.payload.pagination,
                isLoading: false,
                error: null
            };
        case 'SET_CURRENT_SERVICE':
            return { ...state, currentService: action.payload, isLoading: false, error: null };
        case 'ADD_SERVICE':
            return { ...state, services: [action.payload, ...state.services], isLoading: false, error: null };
        case 'UPDATE_SERVICE':
            return {
                ...state,
                services: state.services.map(service =>
                    service._id === action.payload._id ? action.payload : service
                ),
                currentService: action.payload,
                isLoading: false,
                error: null
            };
        case 'DELETE_SERVICE':
            return {
                ...state,
                services: state.services.filter(service => service._id !== action.payload),
                isLoading: false,
                error: null
            };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'SET_SEARCH_QUERY':
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

const ServiceContext = createContext(undefined);

export const ServiceProvider = ({ children }) => {
    const [state, dispatch] = useReducer(serviceReducer, initialState);

    const fetchServices = async (params = {}) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await listServices(params);
            dispatch({
                type: 'SET_SERVICES',
                payload: {
                    items: response.data.items,
                    pagination: response.data.pagination
                }
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch services' });
        }
    };

    const fetchServiceById = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await getServiceById(id);
            dispatch({ type: 'SET_CURRENT_SERVICE', payload: response.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch service' });
        }
    };

    const createServiceHandler = async (serviceData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            if (!serviceData.heroImage && !serviceData.heroImageUrl) {
                throw new Error('Hero image is required');
            }
            const response = await createService(serviceData);
            dispatch({ type: 'ADD_SERVICE', payload: response.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create service' });
            throw error;
        }
    };

    const updateServiceHandler = async (id, serviceData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await updateService(id, serviceData);
            dispatch({ type: 'UPDATE_SERVICE', payload: response.data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update service' });
            throw error;
        }
    };

    const deleteServiceHandler = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deleteService(id);
            dispatch({ type: 'DELETE_SERVICE', payload: id });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete service' });
            throw error;
        }
    };

    const setSearchQuery = (query) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    return (
        <ServiceContext.Provider value={{
            state,
            fetchServices,
            fetchServiceById,
            createService: createServiceHandler,
            updateService: updateServiceHandler,
            deleteService: deleteServiceHandler,
            setSearchQuery,
            clearError,
        }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within ServiceProvider');
    }
    return context;
};