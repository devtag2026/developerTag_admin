"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCareer } from '../../context/CareerContext';
import CareerCard from './CareerCard';

const CareerDashboard = () => {
    const router = useRouter();
    const { state, fetchCareers, setSearch } = useCareer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchCareers({ page: currentPage, limit: 10, search: state.searchQuery });
    }, [currentPage, state.searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateNew = () => {
        router.push('/admin/careers/create-career');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#00bba7]">
                <h1 className="text-3xl font-semibold text-gray-800">Career Positions</h1>
                <button
                    className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    onClick={handleCreateNew}
                >
                    Add New Position
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by title, description, or location..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Search
                    </button>
                    {state.searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSearchInput('');
                                setCurrentPage(1);
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </form>

                {/* Active filters display */}
                {state.searchQuery && (
                    <div className="text-sm text-gray-600">
                        Showing results for: <span className="font-medium">"{state.searchQuery}"</span>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            {/* Loading State */}
            {state.isLoading && (
                <div className="text-center py-16 text-gray-600">Loading careers...</div>
            )}

            {/* Career List */}
            {!state.isLoading && (
                <>
                    {state.items && state.items.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {state.items.map((career) => (
                                    <CareerCard key={career._id} item={career} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {state.pagination && state.pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!state.pagination.hasPrevPage || currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-gray-700">
                                        Page {state.pagination.page} of {state.pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!state.pagination.hasNextPage}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* Summary */}
                            {state.pagination && (
                                <div className="mt-6 text-sm text-gray-600 text-center">
                                    Showing {state.items.length} of {state.pagination.total} career positions
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-600 mb-4">No career positions found.</p>
                            <button
                                onClick={handleCreateNew}
                                className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Create Your First Position
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CareerDashboard;

