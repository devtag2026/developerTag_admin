"use client";
import React from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useSidebar, SidebarProvider } from '../../context/SidebarContext';

const LayoutContent = ({ children }) => {
    const { open, setOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            <div className={`transition-all duration-300 ease-in-out xl:ml-64`}>
                <Header />

                <main className="p-4 sm:p-6 lg:p-8">
                    <div className="max-w-full">
                        {children}
                    </div>
                </main>
            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
};

const DashboardLayout = ({ children }) => {
    return (
        <SidebarProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </SidebarProvider>
    );
};

export default DashboardLayout;