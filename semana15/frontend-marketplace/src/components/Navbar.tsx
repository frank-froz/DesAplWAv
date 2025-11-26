'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-semibold text-gray-900">
                        ProductStore
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Productos
                        </Link>
                        {user?.role === 'ADMIN' && (
                            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Dashboard
                            </Link>
                        )}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Hola, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}