"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    CalendarDays,
    FileText,
    CheckSquare,
    Clock,
    Briefcase,
    X
} from "lucide-react";
import { useSidebar } from '../../context/SidebarContext';

// Navigation items
export const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/submitted-forms", label: "Submitted Forms", icon: ClipboardList },
    { path: "/admin/services", label: "Services", icon: BookOpen },
    { path: "/admin/testimonial", label: "Testimonials", icon: FileText },
    { path: "/admin/portfolio", label: "Portfolio", icon: CalendarDays },
    { path: "/admin/careers", label: "Careers", icon: Briefcase }
];

const Sidebar = () => {
    const { open, setOpen } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();

    const handleLinkClick = (path) => {
        // Navigate to the path using Next.js router
        router.push(path);

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1280) {
            setOpen(false);
        }
    };

    return (
        <>
            <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 overflow-y-auto hide-scrollbar
                ${open ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}>

                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src="/logo.png"
                                    alt="Developer Tag Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">Developer Tag</h1>
                                <p className="text-xs text-gray-500">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            className="p-1 rounded hover:bg-gray-100 xl:hidden transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-3">
                    <div className="space-y-1">
                        {navItems.map(({ path, label, icon: Icon }) => {
                            const isActive = pathname === path;
                            return (
                                <button
                                    key={path}
                                    onClick={() => handleLinkClick(path)}
                                    className={`w-full cursor-pointer flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-left relative
                                        ${isActive
                                            ? "bg-teal-50 text-teal-700 border border-teal-100"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                        }`}
                                >

                                    <Icon
                                        size={20}
                                        className={isActive ? "text-teal-600" : "text-gray-500"}
                                    />
                                    <span className="font-medium text-base">{label}</span>

                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
                    <div className="text-xs text-gray-500 text-center">
                        Developed By Developer Tag
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;