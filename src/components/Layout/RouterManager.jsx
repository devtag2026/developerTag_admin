"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';

const AUTH_ROUTES = ['/sign-in'];

const RouterManager = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    useEffect(() => {
        let role = null;
        let hasToken = false;
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            hasToken = Boolean(accessToken);
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    role = user?.role ? String(user.role).toLowerCase() : null;
                } catch (e) {
                    role = null;
                }
            }
        }

        const isAdminUser = hasToken && role === 'admin';
        setIsAdmin(isAdminUser);

        if (isAuthRoute) {
            if (isAdminUser) router.replace('/admin/dashboard');
            setChecked(true);
            return;
        }

        if (!isAdminUser) {
            router.replace('/sign-in');
            setChecked(true);
            return;
        }

        setChecked(true);
    }, [pathname, isAuthRoute, router]);

    if (!checked) return null;

    if (isAuthRoute) return <>{children}</>;

    return <DashboardLayout>{children}</DashboardLayout>;
};

export default RouterManager;