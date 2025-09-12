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
        title: '',
        testimonialImg: null
    });
    const [imagePreview, setImagePreview] = useState('');
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
                title: state.currentTestimonial.title || '',
                testimonialImg: null
            });
            setImagePreview(state.currentTestimonial.testimonialImg || '');
        }
    }, [state.currentTestimonial, isEditing]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                testimonialImg: file
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
                content: formData.content,
                name: formData.name,
                title: formData.title
            };

            if (formData.testimonialImg) {
                submitData.testimonialImg = formData.testimonialImg;
            }

            if (isEditing) {
                await updateTestimonial(id, submitData);
            } else {
                await createTestimonial(submitData);
            }

            router.replace('/admin/testimonials');
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
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                        Customer Title/Position <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., CEO at Company Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                    />
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

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="testimonialImg">
                        Customer Photo {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="file"
                        id="testimonialImg"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={false}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900 appearance-none"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                        </div>
                    )}
                    {!isEditing && (
                        <p className="text-sm text-gray-500 mt-1">
                            Upload a photo of the customer
                        </p>
                    )}
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors text-gray-900"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-[#00bba7] hover:bg-[#009689] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 text-gray-900        "
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