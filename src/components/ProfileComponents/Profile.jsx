"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { state, updateAccount, updateAvatar, clearError } = useAuth();
    const user = state.user;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || user?.name || '',
        email: user?.email || ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (state.error) clearError();
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await updateAccount(formData);
            if (avatarFile) {
                await updateAvatar(avatarFile);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Update failed:', error);
        }
        setIsSubmitting(false);
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        const name = user.fullName || user.name || 'User';
        const nameParts = name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getUserAvatarUrl = () => {
        if (!user) return '';
        return user.avatar || user.avatarUrl || user.profileImage || user.image || user.photo || '';
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-[#00bba7] hover:bg-[#009689] text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>

                {state.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {state.error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="flex items-center space-x-6 mb-6">
                        <div className="flex-shrink-0">
                            {getUserAvatarUrl() ? (
                                <img
                                    src={getUserAvatarUrl()}
                                    alt={user?.fullName || user?.name || 'User'}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-[#00bba7] rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {getUserInitials()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="text-sm text-gray-600"
                                />
                            ) : (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {user?.fullName || user?.name || 'User'}
                                    </h2>
                                    <p className="text-gray-600">{user?.email || 'No email'}</p>
                                    <p className="text-sm text-gray-500">Admin</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] text-gray-900"
                                />
                            ) : (
                                <p className="text-gray-900">{user?.fullName || user?.name || 'No name'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bba7] text-gray-900  "
                                />
                            ) : (
                                <p className="text-gray-900">{user?.email || 'No email'}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <p className="text-gray-900">Admin</p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#00bba7] hover:bg-[#009689] text-white rounded-lg disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;