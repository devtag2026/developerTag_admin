"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortfolio } from '../../context/PortfolioContext';

const PortfolioFormPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { state, createPortfolio, updatePortfolio, fetchPortfolioById } = usePortfolio();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cost: '',
        url: '',
        category: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const loadedPortfolioIdRef = useRef(null);

    const categories = [
        'custom-software-solutions',
        'web-development',
        'e-commerce',
        'app-development',
        'content-management-system',
        'desktop-applications',
        'software-as-a-service'
    ];

    const isEditing = !!id;

    // Reset ref when id changes to a different portfolio
    useEffect(() => {
        if (id && loadedPortfolioIdRef.current && loadedPortfolioIdRef.current !== id) {
            loadedPortfolioIdRef.current = null;
        }
    }, [id]);

    useEffect(() => {
        if (isEditing && id && loadedPortfolioIdRef.current !== id) {
            fetchPortfolioById(id);
        }
    }, [isEditing, id, fetchPortfolioById]);

    useEffect(() => {
        // Only initialize form data once when portfolio is first loaded
        // Don't re-initialize when state.current changes due to updates
        if (isEditing && state.current && state.current._id === id && loadedPortfolioIdRef.current !== id) {
            const portfolio = state.current;
            setFormData({
                name: portfolio.name || '',
                description: portfolio.description || '',
                cost: portfolio.cost || '',
                url: portfolio.url || '',
                category: portfolio.category || '',
                image: null
            });
            setImagePreview(portfolio.image || '');
            loadedPortfolioIdRef.current = id;
        }
    }, [state.current, isEditing, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const submitData = {
                name: formData.name,
                description: formData.description,
                cost: formData.cost,
                url: formData.url,
                category: formData.category
            };

            // Only send image if a new file is uploaded
            if (formData.image && formData.image instanceof File) {
                submitData.image = formData.image;
            }

            // Validate that image is provided for new portfolios
            if (!isEditing && !submitData.image) {
                alert('Please provide an image file');
                setIsSubmitting(false);
                return;
            }

            if (isEditing) {
                await updatePortfolio(id, submitData);
            } else {
                await createPortfolio(submitData);
            }

            router.replace('/admin/portfolio');
        } catch (err) {
            console.error('Save failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save portfolio';
            alert(errorMessage);
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        router.replace('/admin/portfolio');
    };

    if (isEditing && state.isLoading && !state.current) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white">
                <div className="text-center py-16 text-gray-600">Loading portfolio...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <button
                    onClick={handleCancel}
                    className="text-[#00bba7] hover:text-[#009689] mb-4 flex items-center gap-2 transition-colors"
                >
                    ← Back to Portfolio
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 border-b-2 border-[#00bba7] pb-4">
                    {isEditing ? 'Edit Portfolio' : 'Create New Portfolio'}
                </h1>
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name and Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="cost">
                            Cost <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="cost"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            required
                            placeholder="e.g., $5,000 - $10,000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                </div>

                {/* Row 2: Description (Full Width) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        placeholder="Enter project description"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all resize-none text-gray-900"
                    />
                </div>

                {/* Row 3: Category and URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900 bg-white"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="url">
                            Project URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                </div>

                {/* Row 4: Image (Full Width) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                        Project Image {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-4">
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00bba7] file:text-white hover:file:bg-[#009689] cursor-pointer"
                        />
                        {imagePreview && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-3">Image Preview:</p>
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-w-md h-64 object-contain rounded-lg border border-gray-300 bg-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#00bba7] hover:bg-[#009689] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Portfolio' : 'Create Portfolio')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioFormPage;
