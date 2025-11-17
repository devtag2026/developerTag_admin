"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTestimonials } from '../../context/TestimonialContext';

const TestimonialFormPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { createTestimonial, updateTestimonial, fetchTestimonialById, state } = useTestimonials();

    const [formData, setFormData] = useState({
        content: '',
        name: '',
        category: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!id;

    useEffect(() => {
        if (isEditing && id) {
            fetchTestimonialById(id);
        }
    }, [id, isEditing]);

    useEffect(() => {
        if (isEditing && state.currentTestimonial) {
            setFormData({
                content: state.currentTestimonial.content || '',
                name: state.currentTestimonial.name || '',
                category: state.currentTestimonial.category || ''
            });
        }
    }, [state.currentTestimonial, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                content: formData.content,
                name: formData.name,
                category: formData.category
            };

            if (isEditing) {
                await updateTestimonial(id, submitData);
            } else {
                await createTestimonial(submitData);
            }

            router.replace('/admin/testimonial');
        } catch (error) {
            console.error('Form submission failed:', error);
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        router.replace('/admin/testimonials');
    };

    if (isEditing && state.isLoading && !state.currentTestimonial) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white">
                <div className="text-center py-16 text-gray-600">Loading testimonial...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white">
            <div className="mb-8">
                <button
                    onClick={handleCancel}
                    className="text-[#00bba7] hover:text-[#009689] mb-4 flex items-center gap-2 transition-colors"
                >
                    ← Back to Testimonials
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 border-b-2 border-[#00bba7] pb-4">
                    {isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}
                </h1>
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                        Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter customer name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                        Category <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineering SaaS, Web Development, Mobile App"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Enter the category or industry type (e.g., "Software Engineering SaaS")
                    </p>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="content">
                        Testimonial Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        placeholder="Enter the testimonial content"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors resize-none text-gray-900"
                    />
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors "
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#00bba7] hover:bg-[#009689]  py-3 rounded-lg font-medium transition-colors disabled:opacity-50 text-gray-900        "
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Testimonial' : 'Create Testimonial')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default TestimonialFormPage;