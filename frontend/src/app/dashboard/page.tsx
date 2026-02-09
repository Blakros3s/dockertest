'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'

interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authAPI.getUser()
                setUser(userData)
            } catch (err) {
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [router])

    const handleLogout = async () => {
        try {
            await authAPI.logout()
            router.push('/')
        } catch (err) {
            setError('Logout failed')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[10px] opacity-50">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen p-8">
                {/* Header */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                            Logout
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Welcome Card */}
                    <div className="glass-dark rounded-2xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Welcome back, {user?.username || 'User'}! 👋
                        </h2>
                        <p className="text-gray-300 text-lg">
                            You&apos;re successfully logged in to your dashboard.
                        </p>
                    </div>

                    {/* User Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="glass-dark rounded-xl p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Username</h3>
                            <p className="text-2xl font-semibold text-white">{user?.username}</p>
                        </div>

                        <div className="glass-dark rounded-xl p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                            <p className="text-2xl font-semibold text-white">{user?.email || 'Not provided'}</p>
                        </div>

                        <div className="glass-dark rounded-xl p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">First Name</h3>
                            <p className="text-2xl font-semibold text-white">{user?.first_name || 'Not provided'}</p>
                        </div>

                        <div className="glass-dark rounded-xl p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Last Name</h3>
                            <p className="text-2xl font-semibold text-white">{user?.last_name || 'Not provided'}</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="glass-dark rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                            <p className="text-gray-300">View your activity and statistics</p>
                        </div>

                        <div className="glass-dark rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl mb-4">⚙️</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
                            <p className="text-gray-300">Manage your account preferences</p>
                        </div>

                        <div className="glass-dark rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl mb-4">🔔</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Notifications</h3>
                            <p className="text-gray-300">Stay updated with latest alerts</p>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-8">
                        <Link href="/" className="text-purple-400 hover:text-purple-300 font-medium">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </main>
    )
}
