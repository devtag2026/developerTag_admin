"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useService } from '../../context/ServiceContext';

const ServiceFormPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const { createService, updateService, fetchServiceById, state } = useService();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null,
        imageUrl: ''
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!id;

    useEffect(() => {
        if (isEditing && id) {
            fetchServiceById(id);
        }
    }, [id, isEditing]);

    useEffect(() => {
        if (isEditing && state.currentService) {
            setFormData({
                title: state.currentService.title || '',
                description: state.currentService.description || '',
                image: null,
                imageUrl: state.currentService.imageUrl || ''
            });
            setImagePreview(state.currentService.imageUrl || '');
        }
    }, [state.currentService, isEditing]);

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
                title: formData.title,
                description: formData.description
            };

            if (formData.image) {
                submitData.image = formData.image;
            } else if (formData.imageUrl && !isEditing) {
                submitData.imageUrl = formData.imageUrl;
            }

            if (isEditing) {
                await updateService(id, submitData);
            } else {
                await createService(submitData);
            }

            router.replace('/admin/services');
        } catch (error) {
            console.error('Form submission failed:', error);
        }
        setIsSubmitting(false);
    };

    const handleCancel = () => {
        router.replace('/admin/services');
    };

    if (isEditing && state.isLoading && !state.currentService) {
        return (
            <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
                <div className="text-center py-16 text-gray-600">Loading service...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
            <div className="mb-8">
                <button
                    onClick={handleCancel}
                    className="text-[#00bba7] hover:text-[#009689] mb-4 flex items-center gap-2 transition-colors"
                >
                    ← Back to Services
                </button>
                <h1 className="text-3xl font-semibold text-gray-800 border-b-2 border-[#00bba7] pb-4">
                    {isEditing ? 'Edit Service' : 'Create New Service'}
                </h1>
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                        Service Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter service title"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        placeholder="Enter service description"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors resize-none text-gray-900"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="image">
                        Service Image {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!isEditing}
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
                            Upload an image file for the service
                        </p>
                    )}
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
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Service' : 'Create Service')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceFormPage;