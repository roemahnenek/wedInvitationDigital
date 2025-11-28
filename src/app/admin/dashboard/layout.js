"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for navigation

export default function DashboardLayout({ children }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };
    
    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <button 
                    onClick={handleLogout}
                    className="text-sm font-semibold text-gray-700 hover:underline"
                >
                    Log Out
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="md:col-span-3">
                    <div className="bg-white rounded-2xl shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Menu</h2>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/admin/dashboard" className="font-medium text-gray-700 hover:bg-slate-50 rounded-lg px-3 py-2">Dashboard</Link>
                            <Link href="/admin/dashboard/invitations" className="font-medium text-gray-700 hover:bg-slate-50 rounded-lg px-3 py-2">Invitations</Link>
                            <Link href="/admin/dashboard/templates" className="font-medium text-gray-700 hover:bg-slate-50 rounded-lg px-3 py-2">Templates</Link>
                            <Link href="/admin/dashboard/guests" className="font-medium text-gray-700 hover:bg-slate-50 rounded-lg px-3 py-2">Guests</Link>
                            {/* <a href="#" className="font-medium text-slate-600 hover:bg-slate-50 rounded-lg px-3 py-2">Settings</a> */}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="md:col-span-9">
                    {children}
                </section>
            </div>
        </main>
    );
}
