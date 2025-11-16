import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LogoutButton from '../components/LogoutButton';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl text-gray-900 font-bold">
                            Dashboard
                        </h1>
                        <LogoutButton />
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                            Bienvenido, <span className="font-semibold">{session?.user?.name}</span>
                        </p>
                        <p className="text-gray-600 text-sm">
                            Email: {session?.user?.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}