"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, User2 } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

const Header = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const { setOpen } = useSidebar();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) setShowUserMenu(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setShowUserMenu(false);
        try {
            await logout();
        } finally {
            router.replace('/sign-in');
        }
    };

    const getUserDisplayName = () => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored) return 'Admin';
            const u = JSON.parse(stored);
            return u.fullName || u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Admin';
        } catch {
            return 'Admin';
        }
    };
    const getUserEmail = () => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored) return 'admin@example.com';
            const u = JSON.parse(stored);
            return u.email || 'admin@example.com';
        } catch {
            return 'admin@example.com';
        }
    };
    const getUserInitials = () => {
        const name = getUserDisplayName();
        const nameParts = name.split(' ');
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getUserAvatarUrl = () => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored) return '';
            const u = JSON.parse(stored);
            return (
                u.avatar ||
                u.avatarUrl ||
                u.profileImage ||
                u.image ||
                u.photo ||
                ''
            );
        } catch {
            return '';
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between relative">
            <div className="flex items-center gap-4">
                {/* Hamburger Menu */}
                <button
                    className="xl:hidden p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    onClick={() => setOpen(true)}
                >
                    <Menu size={18} className="text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative" ref={userRef}>
                    <div
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                    >
                        {/* User Avatar */}
                        {getUserAvatarUrl() ? (
                            <img
                                src={getUserAvatarUrl()}
                                alt={getUserDisplayName()}
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-white">
                                    {getUserInitials()}
                                </span>
                            </div>
                        )}

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-800 max-w-[120px] truncate">
                                {getUserDisplayName()}
                            </p>
                            <p className="text-xs text-gray-500 max-w-[120px] truncate">
                                {getUserEmail()}
                            </p>
                        </div>

                        <div className="sm:hidden">
                            <p className="text-sm font-medium text-gray-800">
                                {getUserDisplayName().split(' ')[0]}
                            </p>
                        </div>
                    </div>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-50">
                            <div className="sm:hidden px-3 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-800">
                                    {getUserDisplayName()}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {getUserEmail()}
                                </p>
                            </div>

                            <button
                                onClick={() => window.location.href = '/admin/profile'}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <User2 size={14} className="mr-2 text-gray-500" />
                                View Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={14} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;