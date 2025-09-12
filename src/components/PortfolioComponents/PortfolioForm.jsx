"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePortfolio } from '../../context/PortfolioContext';

const PortfolioFormPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { state, createPortfolio, updatePortfolio, fetchPortfolios } = usePortfolio();

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        tagLine: '',
        projectScopeDescription: '',
        techStack: [],
        previewImage: null,
        websiteDemo: null,
        mobileDemo: null,
        adminPanelImage: null,
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!id;

    useEffect(() => {
        if (isEditing && id) {
            // Find the portfolio from the existing list
            const portfolio = state.items.find(item => item._id === id);
            if (portfolio) {
                setFormData({
                    slug: portfolio.slug || '',
                    title: portfolio.title || '',
                    tagLine: portfolio.tagLine || '',
                    projectScopeDescription: portfolio.projectScopeDescription || '',
                    techStack: portfolio.techStack || [],
                    previewImage: null,
                    websiteDemo: null,
                    mobileDemo: null,
                    adminPanelImage: null,
                });
                setPreviewUrl(portfolio.previewImage || '');
            } else if (state.items.length === 0 && !state.isLoading) {
                // If no items loaded yet, fetch them
                fetchPortfolios({ page: 1, limit: 100 });
            }
        }
    }, [isEditing, id, state.items, state.isLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTechStackChange = (e) => {
        const value = e.target.value;
        const parts = value.split(',').map(t => t.trim()).filter(Boolean);
        setFormData(prev => ({ ...prev, techStack: parts.map(tech => ({ tech })) }));
    };

    const handleFile = (name) => (e) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, [name]: file }));
        if (name === 'previewImage' && file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = { ...formData };
            if (isEditing) {
                await updatePortfolio(id, payload);
            } else {
                await createPortfolio(payload);
            }
            router.replace('/admin/portfolio');
        } catch (err) {
            console.error('Save failed:', err);
        }
        setIsSubmitting(false);
    };

    const cancel = () => router.replace('/admin/portfolio');

    // Show loading if we're editing but don't have the portfolio data yet
    if (isEditing && state.items.length === 0 && state.isLoading) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white">
                <div className="text-center py-8">
                    <div className="text-gray-600">Loading portfolio data...</div>
                </div>
            </div>
        );
    }

    // Show error if we're editing but can't find the portfolio
    if (isEditing && state.items.length > 0 && !state.items.find(item => item._id === id)) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-white">
                <div className="text-center py-8">
                    <div className="text-red-600 mb-4">Portfolio not found</div>
                    <button
                        onClick={cancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    >
                        Back to Portfolio List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                {isEditing ? 'Edit Portfolio' : 'Create New Portfolio'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Slug</label>
                    <input name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Tagline</label>
                    <input name="tagLine" value={formData.tagLine} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Project Scope Description</label>
                    <textarea name="projectScopeDescription" value={formData.projectScopeDescription} onChange={handleChange} rows="5" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Tech Stack (comma separated)</label>
                    <input onChange={handleTechStackChange} defaultValue={formData.techStack?.map(t => t.tech).join(', ')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Preview Image</label>
                        <input type="file" accept="image/*" onChange={handleFile('previewImage')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                        {previewUrl && <img src={previewUrl} alt="Preview" className="w-32 h-32 mt-3 rounded-lg object-cover border" />}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Website Demo</label>
                        <input type="file" accept="image/*,video/*" onChange={handleFile('websiteDemo')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Mobile Demo</label>
                        <input type="file" accept="image/*,video/*" onChange={handleFile('mobileDemo')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Admin Panel Image</label>
                        <input type="file" accept="image/*" onChange={handleFile('adminPanelImage')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] text-gray-900" />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors" onClick={cancel}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#00bba7] hover:bg-[#009689] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50">{isSubmitting ? 'Saving…' : (isEditing ? 'Update Portfolio' : 'Create Portfolio')}</button>
                </div>
            </form>
        </div>
    );
};

export default PortfolioFormPage;


