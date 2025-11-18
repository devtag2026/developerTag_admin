"use client";

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { listCareers, createCareer, updateCareer, deleteCareer, getCareerById } from '../api/CareerApi';

const initialState = {
    items: [],
    pagination: null,
    current: null,
    isLoading: false,
    error: null,
    searchQuery: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LIST':
            return { ...state, items: action.payload.items, pagination: action.payload.pagination, isLoading: false, error: null };
        case 'SET_CURRENT':
            return { ...state, current: action.payload, isLoading: false, error: null };
        case 'ADD':
            return { ...state, items: [action.payload, ...state.items], isLoading: false, error: null };
        case 'UPDATE':
            return {
                ...state,
                items: state.items.map(c => (c._id === action.payload._id ? action.payload : c)),
                current: action.payload,
                isLoading: false,
                error: null,
            };
        case 'DELETE':
            return { ...state, items: state.items.filter(c => c._id !== action.payload), isLoading: false, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        default:
            return state;
    }
};

const CareerContext = createContext(undefined);

export const CareerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchCareers = async (params = {}) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { page = 1, limit = 10, search = state.searchQuery } = params;
            const res = await listCareers({ page, limit, search });
            const items = res.data?.items || res.items || [];
            const pagination = res.data?.pagination || res.pagination || null;
            dispatch({ type: 'SET_LIST', payload: { items, pagination } });
        } catch (error) {
            const errorMessage = error.message || error.data?.message || 'Failed to fetch careers';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const fetchCareerById = useCallback(async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await getCareerById(id);
            dispatch({ type: 'SET_CURRENT', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch career' });
        }
    }, []);

    const createCareerHandler = async (data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await createCareer(data);
            dispatch({ type: 'ADD', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create career' });
            throw error;
        }
    };

    const updateCareerHandler = async (id, data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await updateCareer(id, data);
            dispatch({ type: 'UPDATE', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update career' });
            throw error;
        }
    };

    const deleteCareerHandler = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deleteCareer(id);
            dispatch({ type: 'DELETE', payload: id });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete career' });
            throw error;
        }
    };

    const setSearch = (q) => dispatch({ type: 'SET_SEARCH', payload: q });
    const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

    return (
        <CareerContext.Provider value={{
            state,
            fetchCareers,
            fetchCareerById,
            createCareer: createCareerHandler,
            updateCareer: updateCareerHandler,
            deleteCareer: deleteCareerHandler,
            setSearch,
            clearError,
        }}>
            {children}
        </CareerContext.Provider>
    );
};

export const useCareer = () => {
    const ctx = useContext(CareerContext);
    if (!ctx) throw new Error('useCareer must be used within CareerProvider');
    return ctx;
};

