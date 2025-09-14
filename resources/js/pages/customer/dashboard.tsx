import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface Booking {
    id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    status: string;
    total_amount: number;
    studio: {
        id: number;
        name: string;
        hourly_rate: number;
    };
}

interface Props {
    recentBookings: Booking[];
    upcomingBookings: Booking[];
    [key: string]: unknown;
}

export default function CustomerDashboard({ recentBookings, upcomingBookings }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'paid':
                return '✅';
            case 'completed':
                return '🎵';
            case 'cancelled':
                return '❌';
            default:
                return '📄';
        }
    };

    const quickActions = [
        {
            title: 'Book a Studio',
            description: 'Find and book your perfect studio',
            href: route('studios.index'),
            icon: 'calendar',
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'My Bookings',
            description: 'View all your booking history',
            href: route('bookings.index'),
            icon: 'document-text',
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Browse Studios',
            description: 'Explore available studios',
            href: route('studios.index'),
            icon: 'music-note',
            color: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

    return (
        <AppShell>
            <Head title="Customer Dashboard" />
            
            <div className="space-y-8">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎵 Welcome to StudioBook
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your studio bookings and discover new recording spaces
                    </p>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        ⚡ Quick Actions
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4">
                                    <Button
                                        asChild
                                        className={`w-full ${action.color} text-left justify-start h-auto p-4`}
                                    >
                                        <Link href={action.href}>
                                            <div className="flex items-start space-x-3">
                                                <Icon name={action.icon} className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="font-medium">{action.title}</div>
                                                    <div className="text-sm opacity-90 mt-1">{action.description}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upcoming Bookings */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📅 Upcoming Sessions
                        </h2>
                        {upcomingBookings.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <Card key={booking.id}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">{booking.studio.name}</CardTitle>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Icon name="calendar" className="w-4 h-4" />
                                                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Icon name="clock" className="w-4 h-4" />
                                                    <span>{booking.start_time} - {booking.end_time}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Icon name="currency-dollar" className="w-4 h-4" />
                                                    <span>Rp {booking.total_amount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('bookings.show', booking.id)}>
                                                        View Details →
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {upcomingBookings.length === 3 && (
                                    <div className="text-center">
                                        <Button variant="outline" asChild>
                                            <Link href={route('bookings.index')}>
                                                View All Bookings
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Icon name="calendar" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Upcoming Sessions
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Ready to book your next studio session?
                                    </p>
                                    <Button asChild>
                                        <Link href={route('studios.index')}>
                                            🎯 Book a Studio
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Recent Bookings */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            📋 Recent Activity
                        </h2>
                        {recentBookings.length > 0 ? (
                            <div className="space-y-3">
                                {recentBookings.map((booking) => (
                                    <Card key={booking.id} className="py-2">
                                        <CardContent className="py-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {booking.studio.name}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {getStatusIcon(booking.status)} {booking.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {new Date(booking.booking_date).toLocaleDateString()} • 
                                                        {booking.start_time} - {booking.end_time}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        Rp {booking.total_amount.toLocaleString()}
                                                    </div>
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <Link href={route('bookings.show', booking.id)}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <div className="text-center">
                                    <Button variant="outline" asChild>
                                        <Link href={route('bookings.index')}>
                                            View All History
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Icon name="document-text" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No Booking History
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Your booking history will appear here.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* FCFS Information */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                            <Icon name="lightning-bolt" className="w-5 h-5 mr-2" />
                            First Come First Served Booking
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-4 gap-4 text-center">
                            <div className="text-blue-800 dark:text-blue-200">
                                <div className="text-2xl mb-2">1️⃣</div>
                                <p className="text-sm font-medium">Choose Studio</p>
                                <p className="text-xs opacity-75">Browse available studios</p>
                            </div>
                            <div className="text-blue-800 dark:text-blue-200">
                                <div className="text-2xl mb-2">2️⃣</div>
                                <p className="text-sm font-medium">Check Availability</p>
                                <p className="text-xs opacity-75">Real-time slot checking</p>
                            </div>
                            <div className="text-blue-800 dark:text-blue-200">
                                <div className="text-2xl mb-2">3️⃣</div>
                                <p className="text-sm font-medium">Upload Payment</p>
                                <p className="text-xs opacity-75">QRIS or bank transfer</p>
                            </div>
                            <div className="text-blue-800 dark:text-blue-200">
                                <div className="text-2xl mb-2">4️⃣</div>
                                <p className="text-sm font-medium">Confirmation</p>
                                <p className="text-xs opacity-75">Admin verification</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}