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
        slug: '',
        description: '',
        category: '',
        heroImage: null,
        heroImageUrl: '',
        whyChooseSection: {
            title: 'Why Choose Us',
            items: [{ title: '', content: '' }]
        }
    });
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        'web-development',
        'mobile-development',
        'desktop-development',
        'ui-ux-design',
        'ai-development',
        'erp-solutions',
        'crm-solutions',
        'saas-platforms',
        'blockchain',
        'other'
    ];

    const isEditing = !!id;

    useEffect(() => {
        if (isEditing && id) {
            fetchServiceById(id);
        }
    }, [id, isEditing]);

    useEffect(() => {
        if (isEditing && state.currentService) {
            const service = state.currentService;
            setFormData({
                title: service.title || '',
                slug: service.slug || '',
                description: service.description || '',
                category: service.category || '',
                heroImage: null,
                heroImageUrl: service.heroImage || '',
                whyChooseSection: service.whyChooseSection || {
                    title: 'Why Choose Us',
                    items: [{ title: '', content: '' }]
                }
            });
            setImagePreview(service.heroImage || '');
        }
    }, [state.currentService, isEditing]);

    // Auto-generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // Auto-generate slug when title changes
            if (name === 'title' && !isEditing) {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };

    const handleWhyChooseTitleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            whyChooseSection: {
                ...prev.whyChooseSection,
                title: e.target.value
            }
        }));
    };

    const handleWhyChooseItemChange = (index, field, value) => {
        setFormData(prev => {
            const items = [...prev.whyChooseSection.items];
            items[index] = { ...items[index], [field]: value };
            return {
                ...prev,
                whyChooseSection: {
                    ...prev.whyChooseSection,
                    items
                }
            };
        });
    };

    const addWhyChooseItem = () => {
        setFormData(prev => ({
            ...prev,
            whyChooseSection: {
                ...prev.whyChooseSection,
                items: [...prev.whyChooseSection.items, { title: '', content: '' }]
            }
        }));
    };

    const removeWhyChooseItem = (index) => {
        setFormData(prev => {
            const items = prev.whyChooseSection.items.filter((_, i) => i !== index);
            return {
                ...prev,
                whyChooseSection: {
                    ...prev.whyChooseSection,
                    items: items.length > 0 ? items : [{ title: '', content: '' }]
                }
            };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                heroImage: file
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (e) => {
        setFormData(prev => ({
            ...prev,
            heroImageUrl: e.target.value
        }));
        setImagePreview(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                title: formData.title,
                slug: formData.slug || generateSlug(formData.title),
                description: formData.description,
                category: formData.category,
                whyChooseSection: {
                    title: formData.whyChooseSection.title,
                    items: formData.whyChooseSection.items.filter(item => item.title && item.content)
                }
            };

            if (formData.heroImage) {
                submitData.heroImage = formData.heroImage;
            } else if (formData.heroImageUrl) {
                submitData.heroImage = formData.heroImageUrl;
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
            <div className="max-w-2xl mx-auto p-6 bg-white">
                <div className="text-center py-16 text-gray-600">Loading service...</div>
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

            {/* Service Info Display (when editing) */}
            {isEditing && state.currentService && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="ml-2 font-mono text-gray-900">{state.currentService._id}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Created:</span>
                            <span className="ml-2 text-gray-900">
                                {new Date(state.currentService.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Updated:</span>
                            <span className="ml-2 text-gray-900">
                                {new Date(state.currentService.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
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
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="slug">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        placeholder="web-development"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900 font-mono text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        URL-friendly identifier (auto-generated from title, or enter manually)
                    </p>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900 bg-white"
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
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="heroImage">
                        Hero Image {!isEditing && <span className="text-red-500">*</span>}
                    </label>
                    <div className="space-y-3">
                        <input
                            type="file"
                            id="heroImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900 appearance-none"
                        />
                        <div className="text-sm text-gray-500 text-center">OR</div>
                        <input
                            type="url"
                            id="heroImageUrl"
                            value={formData.heroImageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="Enter image URL"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                        />
                    </div>
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                            />
                        </div>
                    )}
                </div>

                {/* Why Choose Section */}
                <div className="border-t border-gray-200 pt-6">
                    <label className="block text-gray-700 font-medium mb-4">
                        Why Choose Section
                    </label>
                    
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-2" htmlFor="whyChooseTitle">
                            Section Title
                        </label>
                        <input
                            type="text"
                            id="whyChooseTitle"
                            value={formData.whyChooseSection.title}
                            onChange={handleWhyChooseTitleChange}
                            placeholder="Why Choose Our Web Development Services"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-gray-600 text-sm font-medium">
                                Items
                            </label>
                            <button
                                type="button"
                                onClick={addWhyChooseItem}
                                className="text-sm text-[#00bba7] hover:text-[#009689] font-medium"
                            >
                                + Add Item
                            </button>
                        </div>

                        {formData.whyChooseSection.items.map((item, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                                    {formData.whyChooseSection.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeWhyChooseItem(index)}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => handleWhyChooseItemChange(index, 'title', e.target.value)}
                                        placeholder="Item title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900 text-sm"
                                    />
                                    <textarea
                                        value={item.content}
                                        onChange={(e) => handleWhyChooseItemChange(index, 'content', e.target.value)}
                                        placeholder="Item content"
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors resize-none text-gray-900 text-sm"
                                    />
                                </div>
                            </div>
                        ))}
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
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Service' : 'Create Service')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceFormPage;