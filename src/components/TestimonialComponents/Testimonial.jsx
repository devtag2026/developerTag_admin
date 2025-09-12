"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTestimonials } from '../../context/TestimonialContext';
import TestimonialCard from './TestimonialCard';

const TestimonialDashboard = () => {
    const router = useRouter();
    const { state, fetchTestimonials, setSearch } = useTestimonials();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchTestimonials({ page: currentPage, limit: 5, search: state.searchQuery });
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
        router.push('/admin/testimonial/create-testimonial');
    };

    const clearSearch = () => {
        setSearchInput('');
        setSearch('');
        setCurrentPage(1);
    };

    if (state.isLoading && state.testimonials.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6 bg-white">
                <div className="text-center py-16 text-gray-600">Loading testimonials...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#00bba7]">
                <h1 className="text-3xl font-semibold text-gray-800">Testimonials Management</h1>
                <button
                    className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    onClick={handleCreateNew}
                >
                    Add New Testimonial
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4 items-center">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search testimonials..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-2 rounded-lg transition-colors text-gray-900"
                    >
                        Search
                    </button>
                    {state.searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-gray-900"
                        >
                            Clear
                        </button>
                    )}
                </form>
                {state.searchQuery && (
                    <p className="text-sm text-gray-600 mt-2">
                        Showing results for: <span className="font-medium">"{state.searchQuery}"</span>
                    </p>
                )}
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            {/* Results Summary */}
            {state.pagination && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {state.testimonials.length} of {state.pagination.total} testimonials
                </div>
            )}

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {state.testimonials.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {state.searchQuery ? 'No testimonials found' : 'No testimonials created yet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {state.searchQuery
                                ? 'Try adjusting your search criteria'
                                : 'Create your first testimonial to get started'
                            }
                        </p>
                        {!state.searchQuery && (
                            <button
                                className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg transition-colors text-gray-900"
                                onClick={handleCreateNew}
                            >
                                Add New Testimonial
                            </button>
                        )}
                    </div>
                ) : (
                    state.testimonials.map(testimonial => (
                        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                    ))
                )}
            </div>

            {/* Pagination */}
            {state.pagination && state.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!state.pagination.hasPrevPage}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${page === currentPage
                                    ? 'bg-[#00bba7] text-white'
                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!state.pagination.hasNextPage}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestimonialDashboard;