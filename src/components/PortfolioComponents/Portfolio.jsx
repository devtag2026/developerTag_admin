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

            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4 items-center">
                    <div className="flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search portfolio..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500 bg-white"
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 rounded-lg bg-[#00bba7] hover:bg-[#009689] text-white transition-colors">Search</button>
                    {state.searchQuery && (
                        <button type="button" onClick={() => setSearch('')} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">Clear</button>
                    )}
                </form>
            </div>

            {state.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{state.error}</div>
            )}

            {state.pagination && (
                <div className="mb-4 text-sm text-gray-600">Showing {state.items.length} of {state.pagination.total} items</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {state.items.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <h3 className="text-xl font-medium text-gray-800 mb-2">{state.searchQuery ? 'No items found' : 'No portfolios created yet'}</h3>
                        {!state.searchQuery && (
                            <button className="bg-[#00bba7] hover:bg-[#009689] text-white px-6 py-3 rounded-lg transition-colors" onClick={handleCreateNew}>Add New Portfolio</button>
                        )}
                    </div>
                ) : (
                    state.items.map(item => <PortfolioCard key={item._id} item={item} />)
                )}
            </div>

            {state.pagination && state.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={!state.pagination.hasPrevPage} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                    <div className="flex gap-1">
                        {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 text-sm rounded-lg transition-colors ${page === currentPage ? 'bg-[#00bba7] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>{page}</button>
                        ))}
                    </div>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={!state.pagination.hasNextPage} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                </div>
            )}
        </div>
    );
};

export default PortfolioDashboard;


