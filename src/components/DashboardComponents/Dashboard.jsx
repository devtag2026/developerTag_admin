"use client";
import React, { useEffect, useState } from 'react'
import API from '../../config/ApiConfig';

function Dashboard() {
    const [totals, setTotals] = useState({ portfolios: 0, services: 0, testimonials: 0, forms: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await API.get('/stats');
                const data = res.data?.data || {};
                if (!cancelled) setTotals(data.totals || totals);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.message || 'Failed to load stats');
            }
            if (!cancelled) setLoading(false);
        };
        fetchStats();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Developer Tag</h1>
                <p className="text-gray-600">Admin panel overview</p>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Portfolios</p>
                            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totals.portfolios}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">📚</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Services</p>
                            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totals.services}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-bold">📝</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Testimonials</p>
                            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totals.testimonials}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600 font-bold">📊</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Forms</p>
                            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : totals.forms}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold">⭐</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
