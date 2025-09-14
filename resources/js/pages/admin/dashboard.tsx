import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface DashboardStats {
    totalBookings: number;
    pendingBookings: number;
    todayBookings: number;
    totalRevenue: number;
}

interface Props {
    stats: DashboardStats;
    [key: string]: unknown;
}

export default function AdminDashboard({ stats }: Props) {
    const statCards = [
        {
            title: 'Total Bookings',
            value: stats.totalBookings.toLocaleString(),
            icon: 'calendar',
            color: 'bg-blue-500',
            description: 'All time bookings'
        },
        {
            title: 'Pending Verification',
            value: stats.pendingBookings.toLocaleString(),
            icon: 'clock',
            color: 'bg-yellow-500',
            description: 'Awaiting payment verification',
            urgent: stats.pendingBookings > 0
        },
        {
            title: 'Today\'s Sessions',
            value: stats.todayBookings.toLocaleString(),
            icon: 'music-note',
            color: 'bg-green-500',
            description: 'Studios booked for today'
        },
        {
            title: 'Total Revenue',
            value: `Rp ${stats.totalRevenue.toLocaleString()}`,
            icon: 'currency-dollar',
            color: 'bg-purple-500',
            description: 'From completed bookings'
        }
    ];

    const quickActions = [
        {
            title: 'Verify Payments',
            description: 'Review and verify pending payment proofs',
            href: route('bookings.index', { status: 'pending' }),
            icon: 'check-circle' as const,
            color: 'bg-yellow-600 hover:bg-yellow-700',
            urgent: stats.pendingBookings > 0
        },
        {
            title: 'Manage Studios',
            description: 'Add, edit, or deactivate studios',
            href: route('studios.index'),
            icon: 'cog' as const,
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'View All Bookings',
            description: 'Browse all bookings and their statuses',
            href: route('bookings.index'),
            icon: 'calendar' as const,
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Add New Studio',
            description: 'Create a new studio for booking',
            href: route('studios.create'),
            icon: 'plus' as const,
            color: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

    return (
        <AppShell>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎛️ Admin Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor your studio booking system performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card key={index} className={`${stat.urgent ? 'ring-2 ring-yellow-400 ring-opacity-75' : ''}`}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                    {stat.urgent && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Urgent
                                        </span>
                                    )}
                                </CardTitle>
                                <div className={`${stat.color} p-2 rounded-md`}>
                                    <Icon name={stat.icon} className="w-4 h-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        ⚡ Quick Actions
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Card key={index} className={`hover:shadow-lg transition-shadow ${action.urgent ? 'border-yellow-400' : ''}`}>
                                <CardContent className="p-4">
                                    <Button
                                        asChild
                                        className={`w-full ${action.color} text-left justify-start h-auto p-4`}
                                    >
                                        <Link href={action.href}>
                                            <div className="flex items-start space-x-3">
                                                <Icon name={action.icon} className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="font-medium">
                                                        {action.title}
                                                        {action.urgent && (
                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                !
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm opacity-90 mt-1">
                                                        {action.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        📈 System Overview
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* FCFS Algorithm Info */}
                        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                            <CardHeader>
                                <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                                    <Icon name="lightning-bolt" className="w-5 h-5 mr-2" />
                                    FCFS Algorithm Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-800 dark:text-blue-200">Algorithm:</span>
                                        <span className="font-medium text-blue-900 dark:text-blue-100">First Come First Served</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-blue-800 dark:text-blue-200">Status:</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✅ Active
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        All bookings are processed in chronological order to ensure fairness.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CardHeader>
                                <CardTitle className="text-green-900 dark:text-green-100 flex items-center">
                                    <Icon name="credit-card" className="w-5 h-5 mr-2" />
                                    Payment Methods
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-green-800 dark:text-green-200">QRIS (QR Payment)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-green-800 dark:text-green-200">Bank Transfer</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-green-800 dark:text-green-200">Cash (On-site)</span>
                                    </div>
                                    <p className="text-xs text-green-700 dark:text-green-300">
                                        Multiple payment options for customer convenience.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Action Reminder */}
                {stats.pendingBookings > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <Icon name="exclamation-triangle" className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-red-900 dark:text-red-100">
                                        Action Required: {stats.pendingBookings} Pending Payment{stats.pendingBookings !== 1 ? 's' : ''}
                                    </h3>
                                    <p className="text-red-800 dark:text-red-200 text-sm mt-1">
                                        Some customers are waiting for payment verification. Review and approve payments to complete their bookings.
                                    </p>
                                    <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700" asChild>
                                        <Link href={route('bookings.index', { status: 'pending' })}>
                                            Review Pending Payments →
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppShell>
    );
}