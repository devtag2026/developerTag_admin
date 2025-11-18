"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCareer } from '../../context/CareerContext';

const CareerCard = ({ item }) => {
    const router = useRouter();
    const { deleteCareer } = useCareer();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        router.push(`/admin/careers/${item._id}/edit`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteCareer(item._id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setIsDeleting(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
                <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                        }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.location}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{item.type}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{item.experience}</span>
                    </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex gap-3">
                    <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowDeleteConfirm(false)}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-xl shadow-lg p-5 sm:p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Delete career position?</h4>
                        <p className="text-sm text-gray-600 mb-5">
                            This action cannot be undone. Remove "{item.title}"?
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button
                                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors"
                                onClick={() => setShowDeleteConfirm(false)}
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

export default CareerCard;

