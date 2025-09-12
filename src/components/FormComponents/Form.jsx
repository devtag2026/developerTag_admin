"use client";
import React, { useState, useEffect } from 'react';
import API from '../../config/ApiConfig';

const SubmittedForms = () => {
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Fetch form submissions
    const fetchSubmissions = async (params = {}) => {
        setIsLoading(true);
        setError('');
        try {
            const { page = 1, limit = 10, search = '', type = '' } = params;
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search }),
                ...(type && { type })
            });

            const response = await API.get(`/forms?${queryParams}`);

            if (response.data.success) {
                setSubmissions(response.data.data.items);
                setPagination(response.data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch form submissions');
            console.error('Error fetching submissions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and when params change
    useEffect(() => {
        fetchSubmissions({
            page: currentPage,
            limit: 10,
            search: searchQuery,
            type: typeFilter
        });
    }, [currentPage, searchQuery, typeFilter]);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    // Clear search
    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Clear type filter
    const clearTypeFilter = () => {
        setTypeFilter('');
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get unique form types for filter dropdown
    const getUniqueFormTypes = () => {
        const types = [...new Set(submissions.map(sub => sub.formType).filter(Boolean))];
        return types;
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white">
            <div className="mb-8 pb-6 border-b-2 border-[#00bba7]">
                <h1 className="text-3xl font-semibold text-gray-800">Form Submissions</h1>
                <p className="text-gray-600 mt-2">Manage and view all form submissions</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-4">
                <form onSubmit={handleSearch} className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name, email, or description..."
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
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-gray-900"
                        >
                            Clear Search
                        </button>
                    )}
                </form>

                {/* Type Filter */}
                <div className="flex gap-4 items-center flex-wrap">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00bba7] transition-colors text-gray-900"
                    >
                        <option value="">All Form Types</option>
                        {getUniqueFormTypes().map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {typeFilter && (
                        <button
                            type="button"
                            onClick={clearTypeFilter}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm text-gray-900"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>

                {/* Active filters display */}
                {(searchQuery || typeFilter) && (
                    <div className="text-sm text-gray-600">
                        Active filters:
                        {searchQuery && <span className="ml-2 font-medium">Search: "{searchQuery}"</span>}
                        {typeFilter && <span className="ml-2 font-medium">Type: "{typeFilter}"</span>}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && submissions.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                    Loading form submissions...
                </div>
            )}

            {/* Results Summary */}
            {pagination && !isLoading && (
                <div className="mb-4 text-sm text-gray-600">
                    Showing {submissions.length} of {pagination.total} submissions
                </div>
            )}

            {/* Submissions Table */}
            {!isLoading && submissions.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Form Type</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <tr key={submission._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="font-medium text-gray-900">
                                                {submission.name || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-gray-600">
                                                {submission.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-[#00bba7] bg-opacity-10 text-[#00bba7] rounded-full">
                                                {submission.formType || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-gray-600 max-w-xs truncate" title={submission.description}>
                                                {submission.description || 'No description'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(submission.createdAt)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && submissions.length === 0 && (
                <div className="text-center py-16">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                        {searchQuery || typeFilter ? 'No submissions found' : 'No form submissions yet'}
                    </h3>
                    <p className="text-gray-600">
                        {searchQuery || typeFilter
                            ? 'Try adjusting your search criteria or filters'
                            : 'Form submissions will appear here when users submit forms'
                        }
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && !isLoading && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${page === currentPage
                                    ? 'bg-[#00bba7] text-white'
                                    : 'border border-gray-300 hover:bg-gray-50 text-gray-900 '
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-900"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubmittedForms;