"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '../../context/PortfolioContext';
import PortfolioCard from './PortfolioCard';

const PortfolioDashboard = () => {
    const router = useRouter();
    const { state, fetchPortfolios, setSearch } = usePortfolio();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        fetchPortfolios({ page: currentPage, limit: 10, search: state.searchQuery });
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
        router.push('/admin/portfolio/create-portfolio');
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#00bba7]">
                <h1 className="text-3xl font-semibold text-gray-800">Portfolio Management</h1>
                <button
                    className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    onClick={handleCreateNew}
                >
                    Add New Portfolio
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name, description, or cost..."
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
                        Active filters:
                        {state.searchQuery && <span className="ml-2 font-medium">Search: "{state.searchQuery}"</span>}
                    </div>
                )}
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {state.error}
                </div>
            )}

            {/* Results Summary */}
            {state.pagination && !state.isLoading && (
                <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{state.items.length}</span> of <span className="font-semibold text-gray-900">{state.pagination.total}</span> portfolios
                    </div>
                </div>
            )}

            {/* Loading State */}
            {state.isLoading && state.items.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                    Loading portfolios...
                </div>
            )}

            {/* Portfolios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {!state.isLoading && state.items.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {state.searchQuery ? 'No portfolios found' : 'No portfolios created yet'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {state.searchQuery
                                ? 'Try adjusting your search criteria'
                                : 'Create your first portfolio to get started'
                            }
                        </p>
                        {!state.searchQuery && (
                            <button
                                className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg transition-colors"
                                onClick={handleCreateNew}
                            >
                                Add New Portfolio
                            </button>
                        )}
                    </div>
                ) : (
                    state.items.map(item => <PortfolioCard key={item._id} item={item} />)
                )}
            </div>

            {/* Pagination */}
            {state.pagination && state.pagination.totalPages > 1 && !state.isLoading && (
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
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default PortfolioDashboard;


