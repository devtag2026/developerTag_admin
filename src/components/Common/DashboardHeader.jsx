"use client";

import React from 'react';

const DashboardHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-4 sm:mb-6">
            {title && (
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
                <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
            )}
        </div>
    );
};

export default DashboardHeader;


