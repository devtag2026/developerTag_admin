"use client";

import React, { createContext, useContext, useReducer } from 'react';
import {
    listTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonialById,
} from '../api/TestimonialsApi';

const initialState = {
    testimonials: [],
    pagination: null,
    currentTestimonial: null,
    isLoading: false,
    error: null,
    searchQuery: '',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_LIST':
            return {
                ...state,
                testimonials: action.payload.items,
                pagination: action.payload.pagination,
                isLoading: false,
                error: null,
            };
        case 'SET_CURRENT':
            return { ...state, currentTestimonial: action.payload, isLoading: false, error: null };
        case 'ADD':
            return { ...state, testimonials: [action.payload, ...state.testimonials], isLoading: false, error: null };
        case 'UPDATE':
            return {
                ...state,
                testimonials: state.testimonials.map(t => (t._id === action.payload._id ? action.payload : t)),
                currentTestimonial: action.payload,
                isLoading: false,
                error: null,
            };
        case 'DELETE':
            return {
                ...state,
                testimonials: state.testimonials.filter(t => t._id !== action.payload),
                isLoading: false,
                error: null,
            };
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

const TestimonialContext = createContext(undefined);

export const TestimonialProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchTestimonials = async (params = {}) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { page = 1, limit = 10, search = state.searchQuery } = params;
            const res = await listTestimonials({ page, limit, search });
            // Handle ApiResponse structure: { statusCode, data: { items, pagination }, message, success }
            const items = res.data?.items || res.items || [];
            const pagination = res.data?.pagination || res.pagination || null;
            dispatch({ type: 'SET_LIST', payload: { items, pagination } });
        } catch (error) {
            const errorMessage = error.message || error.data?.message || 'Failed to fetch testimonials';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const fetchTestimonialById = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await getTestimonialById(id);
            dispatch({ type: 'SET_CURRENT', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to fetch testimonial' });
        }
    };

    const createTestimonialHandler = async (data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await createTestimonial(data);
            dispatch({ type: 'ADD', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to create testimonial' });
            throw error;
        }
    };

    const updateTestimonialHandler = async (id, data) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await updateTestimonial(id, data);
            dispatch({ type: 'UPDATE', payload: res.data || res });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update testimonial' });
            throw error;
        }
    };

    const deleteTestimonialHandler = async (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await deleteTestimonial(id);
            dispatch({ type: 'DELETE', payload: id });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete testimonial' });
            throw error;
        }
    };

    const setSearch = (q) => dispatch({ type: 'SET_SEARCH', payload: q });
    const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

    return (
        <TestimonialContext.Provider
            value={{
                state,
                fetchTestimonials,
                fetchTestimonialById,
                createTestimonial: createTestimonialHandler,
                updateTestimonial: updateTestimonialHandler,
                deleteTestimonial: deleteTestimonialHandler,
                setSearch,
                clearError,
            }}
        >
            {children}
        </TestimonialContext.Provider>
    );
};

export const useTestimonials = () => {
    const ctx = useContext(TestimonialContext);
    if (!ctx) throw new Error('useTestimonials must be used within TestimonialProvider');
    return ctx;
};


