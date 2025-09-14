import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
    [key: string]: unknown;
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: 'music-note',
            title: 'Professional Studios',
            description: 'Access to premium recording, rehearsal, and production studios with state-of-the-art equipment.'
        },
        {
            icon: 'calendar',
            title: 'Easy Booking',
            description: 'First Come First Served booking system ensures fair access to your preferred studio slots.'
        },
        {
            icon: 'mobile',
            title: 'Online Payment',
            description: 'Secure payment via QRIS or bank transfer with instant verification process.'
        },
        {
            icon: 'chart-bar',
            title: 'Real-time Status',
            description: 'Track your booking status from pending to completion with live updates and notifications.'
        }
    ];

    const studioTypes = [
        {
            name: 'Recording Studio',
            description: 'Professional recording with high-end equipment',
            price: 'From Rp 200,000/hour',
            image: '/images/recording-studio.jpg'
        },
        {
            name: 'Rehearsal Room',
            description: 'Perfect for band practice and jamming sessions',
            price: 'From Rp 100,000/hour',
            image: '/images/rehearsal-room.jpg'
        },
        {
            name: 'Production Studio',
            description: 'Complete mixing and mastering facilities',
            price: 'From Rp 250,000/hour',
            image: '/images/production-studio.jpg'
        }
    ];

    return (
        <>
            <Head title="🎵 Studio Booking System" />
            
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                {/* Navigation */}
                <nav className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Icon name="music-note" className="w-8 h-8 text-purple-400" />
                            <h1 className="text-2xl font-bold text-white">StudioBook</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-white">Welcome, {auth.user.name}</span>
                                    <Button asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/register">Register</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            🎵 Book Your Perfect Studio
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            Professional music studios for recording, rehearsal, and production. 
                            First Come First Served booking with secure online payments.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
                                <Link href="/studios">
                                    🎯 Browse Studios
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/bookings/create">
                                    📅 Book Now
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            ✨ Why Choose StudioBook?
                        </h3>
                        <p className="text-gray-300 text-lg">
                            Everything you need for a seamless studio booking experience
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                                <CardHeader className="text-center">
                                    <Icon name={feature.icon} className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-300">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Studio Types */}
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            🎬 Our Studios
                        </h3>
                        <p className="text-gray-300 text-lg">
                            Choose from our variety of professional studio spaces
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {studioTypes.map((studio, index) => (
                            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
                                <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Icon name="music-note" className="w-16 h-16 text-white" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-white">{studio.name}</CardTitle>
                                    <CardDescription className="text-gray-300">
                                        {studio.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-purple-400 font-semibold text-lg mb-4">
                                        {studio.price}
                                    </p>
                                    <Button className="w-full" asChild>
                                        <Link href="/studios">
                                            View Details
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* FCFS Algorithm Explanation */}
                <section className="container mx-auto px-4 py-16">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardHeader className="text-center">
                            <CardTitle className="text-white text-2xl mb-4">
                                ⚡ First Come First Served (FCFS) Booking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="max-w-3xl mx-auto">
                                <p className="text-gray-300 mb-6 text-lg">
                                    Our fair booking system ensures everyone gets equal opportunity to reserve their preferred studio slots.
                                </p>
                                <div className="grid md:grid-cols-4 gap-4 text-center">
                                    <div className="text-white">
                                        <div className="text-2xl mb-2">1️⃣</div>
                                        <p className="text-sm">Choose Studio & Time</p>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-2xl mb-2">2️⃣</div>
                                        <p className="text-sm">Instant Availability Check</p>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-2xl mb-2">3️⃣</div>
                                        <p className="text-sm">Upload Payment Proof</p>
                                    </div>
                                    <div className="text-white">
                                        <div className="text-2xl mb-2">4️⃣</div>
                                        <p className="text-sm">Booking Confirmed</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            🚀 Ready to Book Your Studio?
                        </h3>
                        <p className="text-gray-300 mb-8 text-lg">
                            Join hundreds of musicians who trust StudioBook for their recording needs.
                            Start your musical journey today!
                        </p>
                        
                        {!auth.user ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    <Link href="/register">
                                        🎤 Sign Up Free
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/studios">
                                        👁️ Browse Studios
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                <Link href="/bookings/create">
                                    📅 Create Booking
                                </Link>
                            </Button>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-4 py-8 text-center border-t border-white/20">
                    <p className="text-gray-400">
                        © 2024 StudioBook. Professional music studio booking system with FCFS algorithm.
                    </p>
                </footer>
            </div>
        </>
    );
}