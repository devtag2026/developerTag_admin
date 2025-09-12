"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTestimonials } from '../../context/TestimonialContext';

const TestimonialCard = ({ testimonial }) => {
    const router = useRouter();
    const { deleteTestimonial } = useTestimonials();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        router.push(`/admin/testimonial/${testimonial._id}/edit`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTestimonial(testimonial._id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setIsDeleting(false);
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                {testimonial.testimonialImg ? (
                    <img
                        src={testimonial.testimonialImg}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-500">No Image</div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{testimonial.name}</h3>
                    <p className="text-sm text-[#00bba7] font-medium">{testimonial.title}</p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                    "{testimonial.content}"
                </p>

                <div className="flex gap-3">
                    <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors text-gray-900"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                        onClick={confirmDelete}
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={cancelDelete}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-xl shadow-lg p-5 sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Delete testimonial?</h4>
                        <p className="text-sm text-gray-600 mb-5">
                            This action cannot be undone. Remove testimonial by "{testimonial.name}"?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialCard;