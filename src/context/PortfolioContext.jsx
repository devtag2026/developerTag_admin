"use client";

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { listPortfolios, createPortfolio, updatePortfolio, deletePortfolio, getPortfolioById } from '../api/PortfolioApi';

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
                items: state.items.map(p => (p._id === action.payload._id ? action.payload : p)),
                current: action.payload,
                isLoading: false,
                error: null,
            };
        case 'DELETE':
            return { ...state, items: state.items.filter(p => p._id !== action.payload), isLoading: false, error: null };
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

const PortfolioContext = createContext(undefined);

export const PortfolioProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchPortfolios = async (params = {}) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { page = 1, limit = 10, search = state.searchQuery } = params;
            const res = await listPortfolios({ page, limit, search });
            // Handle ApiResponse structure: { statusCode, data: { items, pagination }, message, success }
            const items = res.data?.items || res.items || [];
            const pagination = res.data?.pagination || res.pagination || null;
            dispatch({ type: 'SET_LIST', payload: { items, pagination } });
        } catch (error) {
            const errorMessage = error.message || error.data?.message || 'Failed to fetch portfolios';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const fetchPortfolioById = useCallback(async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await getPortfolioById(id);
            dispatch({ type: 'SET_CURRENT', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch portfolio' });
        }
    }, []);

    const createPortfolioHandler = async (data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await createPortfolio(data);
            dispatch({ type: 'ADD', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create portfolio' });
            throw error;
        }
    };

    const updatePortfolioHandler = async (id, data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await updatePortfolio(id, data);
            dispatch({ type: 'UPDATE', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update portfolio' });
            throw error;
        }
    };

    const deletePortfolioHandler = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deletePortfolio(id);
            dispatch({ type: 'DELETE', payload: id });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete portfolio' });
            throw error;
        }
    };

    const setSearch = (q) => dispatch({ type: 'SET_SEARCH', payload: q });
    const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

    return (
        <PortfolioContext.Provider value={{
            state,
            fetchPortfolios,
            fetchPortfolioById,
            createPortfolio: createPortfolioHandler,
            updatePortfolio: updatePortfolioHandler,
            deletePortfolio: deletePortfolioHandler,
            setSearch,
            clearError,
        }}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolio = () => {
    const ctx = useContext(PortfolioContext);
    if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
    return ctx;
};


