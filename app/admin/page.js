'use client';

import { useState, useEffect } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
    const [token, setToken] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('admin_token');
        if (saved) {
            // Verify it's still valid
            fetch('/api/portfolio/auth', {
                headers: { Authorization: `Bearer ${saved}` },
            })
                .then(r => r.json())
                .then(d => {
                    if (d.success) {
                        setToken(saved);
                    } else {
                        localStorage.removeItem('admin_token');
                    }
                })
                .catch(() => localStorage.removeItem('admin_token'))
                .finally(() => setChecking(false));
        } else {
            setChecking(false);
        }
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('admin_token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
    };

    if (checking) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="font-mono text-sm text-emerald-500/60 animate-pulse tracking-wider">
                    [AUTHENTICATING...]
                </div>
            </div>
        );
    }

    if (!token) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return <AdminDashboard token={token} onLogout={handleLogout} />;
}
