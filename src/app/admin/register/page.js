"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            setSuccess("Registration successful! You can now log in.");
            setName("");
            setEmail("");
            setPassword("");
            // Optionally redirect to login page after a delay
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                    Admin Registration
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-md p-8 space-y-6"
                >
                    <h2 className="text-lg font-semibold text-center text-gray-900">
                        Create a New Account
                    </h2>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-600">Minimum 6 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full py-3 text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>

                    {error && (
                        <p className="text-sm text-center text-red-600 bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-center text-green-600 bg-green-50 py-2 px-4 rounded-xl">{success}</p>
                    )}
                </form>
                <p className="mt-6 text-center text-sm text-gray-900">
                    Already have an account?{" "}
                    <Link href="/admin/login" className="font-semibold text-amber-600 hover:text-amber-700 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </main>
    );
}
