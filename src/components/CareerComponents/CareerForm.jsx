"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCareer } from '../../context/CareerContext';

const CareerFormPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { state, createCareer, updateCareer, fetchCareerById } = useCareer();

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'Full-time',
        experience: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const loadedCareerIdRef = useRef(null);

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

    const isEditing = !!id;

    // Reset ref when id changes to a different career
    useEffect(() => {
        if (id && loadedCareerIdRef.current && loadedCareerIdRef.current !== id) {
            loadedCareerIdRef.current = null;
        }
    }, [id]);

    useEffect(() => {
        if (isEditing && id && loadedCareerIdRef.current !== id) {
            fetchCareerById(id);
        }
    }, [isEditing, id, fetchCareerById]);

    useEffect(() => {
        if (isEditing && state.current && state.current._id === id && loadedCareerIdRef.current !== id) {
            const career = state.current;
            setFormData({
                title: career.title || '',
                location: career.location || '',
                type: career.type || 'Full-time',
                experience: career.experience || '',
                description: career.description || '',
                requirements: career.requirements && career.requirements.length > 0 ? career.requirements : [''],
                responsibilities: career.responsibilities && career.responsibilities.length > 0 ? career.responsibilities : [''],
                isActive: career.isActive !== undefined ? career.isActive : true
            });
            loadedCareerIdRef.current = id;
        }
    }, [state.current, isEditing, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Filter out empty requirements and responsibilities
            const submitData = {
                title: formData.title,
                location: formData.location,
                type: formData.type,
                experience: formData.experience,
                description: formData.description,
                requirements: formData.requirements.filter(r => r.trim() !== ''),
                responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
                isActive: formData.isActive
            };

            // Validate
            if (submitData.requirements.length === 0) {
                alert('Please provide at least one requirement');
                setIsSubmitting(false);
                return;
            }

            if (submitData.responsibilities.length === 0) {
                alert('Please provide at least one responsibility');
                setIsSubmitting(false);
                return;
            }

            if (isEditing) {
                await updateCareer(id, submitData);
            } else {
                await createCareer(submitData);
            }

            router.replace('/admin/careers');
        } catch (err) {
            console.error('Save failed:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save career position';
            alert(errorMessage);
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        router.replace('/admin/careers');
    };

    if (isEditing && state.isLoading && !state.current) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white">
                <div className="text-center py-16 text-gray-600">Loading career position...</div>
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
                    ← Back to Careers
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 border-b-2 border-[#00bba7] pb-4">
                    {isEditing ? 'Edit Career Position' : 'Create New Career Position'}
                </h1>
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Title and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Senior Full Stack Developer"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Remote / Lahore, Pakistan"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                </div>

                {/* Row 2: Type and Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="type">
                            Job Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900 bg-white"
                        >
                            {jobTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="experience">
                            Experience Level <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Intern, 6 months, 1 year, 5+ years"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                        />
                    </div>
                </div>

                {/* Row 3: Description (Full Width) */}
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
                        placeholder="Enter job description"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all resize-none text-gray-900"
                    />
                </div>

                {/* Row 4: Requirements */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Requirements <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {formData.requirements.map((req, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                    placeholder={`Requirement ${index + 1}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                                />
                                {formData.requirements.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('requirements', index)}
                                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('requirements')}
                            className="text-sm text-[#00bba7] hover:text-[#009689] font-medium"
                        >
                            + Add Requirement
                        </button>
                    </div>
                </div>

                {/* Row 5: Responsibilities */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Responsibilities <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {formData.responsibilities.map((resp, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={resp}
                                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                                    placeholder={`Responsibility ${index + 1}`}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-all text-gray-900"
                                />
                                {formData.responsibilities.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('responsibilities', index)}
                                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('responsibilities')}
                            className="text-sm text-[#00bba7] hover:text-[#009689] font-medium"
                        >
                            + Add Responsibility
                        </button>
                    </div>
                </div>

                {/* Row 6: Active Status */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#00bba7] border-gray-300 rounded focus:ring-[#00bba7]"
                        />
                        <span className="text-gray-700 font-medium">Active Position</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Show this position in public listings</p>
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
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Career Position' : 'Create Career Position')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CareerFormPage;

