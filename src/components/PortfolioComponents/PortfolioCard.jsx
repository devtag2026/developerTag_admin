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
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative">
            <div className="h-48 bg-gray-100 flex items-center justify-center">
                {item.previewImage ? (
                    <img src={item.previewImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-500">No Preview</div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.tagLine}</p>

                <div className="flex gap-3">
                    <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm transition-colors"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
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

export default PortfolioCard;


