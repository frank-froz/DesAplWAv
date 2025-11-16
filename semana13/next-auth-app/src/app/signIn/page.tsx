'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            callbackUrl: '/dashboard',
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else if (result?.ok) {
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    const handleGitHubSignIn = async () => {
        await signIn('github', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Iniciar Sesión
                </h1>

                <form onSubmit={handleCredentialsSignIn}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>

                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O</span>
                    </div>
                </div>
                
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2 mb-2"
                >
                    <FaGoogle />
                    Continuar con Google
                </button>

                <button
                    onClick={handleGitHubSignIn}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                    <FaGithub />
                    Continuar con GitHub
                </button>

                <div className="mt-4 text-center">
                    <a href="/register" className="text-blue-500 hover:text-blue-700">
                        ¿No tienes cuenta? Regístrate
                    </a>
                </div>
            </div>
        </div>
    );
}
