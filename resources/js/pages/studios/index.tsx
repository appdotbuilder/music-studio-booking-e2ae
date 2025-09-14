import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface Studio {
    id: number;
    name: string;
    description: string;
    hourly_rate: number;
    facilities: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedStudios {
    data: Studio[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}

interface Props {
    studios: PaginatedStudios;
    filters: {
        search?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function StudiosIndex({ studios, filters }: Props) {
    const { auth } = usePage<{ auth: { user: { role: string } | null }; [key: string]: unknown }>().props;
    const isAdmin = auth.user?.role === 'admin';

    const handleSearch = (search: string) => {
        router.get(route('studios.index'), { 
            ...filters, 
            search: search || undefined 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleStatusFilter = (status: string) => {
        router.get(route('studios.index'), { 
            ...filters, 
            status: status || undefined 
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    return (
        <AppShell>
            <Head title="Music Studios" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            🎵 Music Studios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {isAdmin ? 'Manage your studio inventory' : 'Choose your perfect studio for recording'}
                        </p>
                    </div>
                    
                    {isAdmin && (
                        <Button asChild>
                            <Link href={route('studios.create')}>
                                ➕ Add Studio
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search studios..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue={filters.search || ''}
                            onChange={(e) => {
                                const timeoutId = setTimeout(() => {
                                    handleSearch(e.target.value);
                                }, 300);
                                return () => clearTimeout(timeoutId);
                            }}
                        />
                    </div>
                    
                    {isAdmin && (
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            value={filters.status || ''}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                        >
                            <option value="">All Studios</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    )}
                </div>

                {/* Studios Grid */}
                {studios.data.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studios.data.map((studio) => (
                            <Card key={studio.id} className={`overflow-hidden ${!studio.is_active ? 'opacity-60' : ''}`}>
                                {/* Studio Image */}
                                <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center relative">
                                    {studio.image ? (
                                        <img 
                                            src={`/storage/${studio.image}`}
                                            alt={studio.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Icon name="music-note" className="w-16 h-16 text-white" />
                                    )}
                                    
                                    {!studio.is_active && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{studio.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {studio.description?.substring(0, 100)}
                                                {studio.description && studio.description.length > 100 ? '...' : ''}
                                            </CardDescription>
                                        </div>
                                        {isAdmin && (
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={route('studios.edit', studio.id)}>
                                                        ✏️
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-green-600">
                                                Rp {studio.hourly_rate.toLocaleString()}/hour
                                            </span>
                                        </div>

                                        {studio.facilities && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    🎛️ Facilities:
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {studio.facilities.substring(0, 80)}
                                                    {studio.facilities.length > 80 ? '...' : ''}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex space-x-2">
                                            <Button asChild className="flex-1">
                                                <Link href={route('studios.show', studio.id)}>
                                                    👁️ View Details
                                                </Link>
                                            </Button>
                                            
                                            {studio.is_active && !isAdmin && (
                                                <Button asChild variant="outline">
                                                    <Link href={route('bookings.create', { studio_id: studio.id })}>
                                                        📅 Book
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Icon name="music-note" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No Studios Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {filters.search ? 'Try adjusting your search criteria.' : 'No studios are available at the moment.'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {studios.meta.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {studios.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url);
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}