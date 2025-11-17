"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '../../context/PortfolioContext';

const PortfolioCard = ({ item }) => {
    const router = useRouter();
    const { deletePortfolio } = usePortfolio();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        router.push(`/admin/portfolio/${item._id}/edit`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePortfolio(item._id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Delete failed:', error);
        }
        setIsDeleting(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">{item.name}</h3>
                    {item.category && (
                        <span className="text-xs text-gray-500 font-medium">
                            {item.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                </p>
                {item.cost && (
                    <p className="text-sm font-medium text-gray-700 mb-4">
                        Cost: {item.cost}
                    </p>
                )}

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
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">Delete portfolio?</h4>
                        <p className="text-sm text-gray-600 mb-5">
                            This action cannot be undone. Remove "{item.name}"?
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

export default PortfolioCard;


