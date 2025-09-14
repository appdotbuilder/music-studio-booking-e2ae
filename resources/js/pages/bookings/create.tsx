import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/icon';

interface Studio {
    id: number;
    name: string;
    description: string;
    hourly_rate: number;
    facilities: string;
    is_active: boolean;
}



interface Props {
    studios: Studio[];
    selectedStudio?: Studio;
    [key: string]: unknown;
}

export default function CreateBooking({ studios, selectedStudio }: Props) {
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedStudioData, setSelectedStudioData] = useState<Studio | null>(selectedStudio || null);

    const { data, setData, post, processing, errors } = useForm({
        studio_id: selectedStudio?.id.toString() || '',
        booking_date: '',
        start_time: '',
        end_time: '',
        duration_hours: 1,
        notes: '',
    });

    // Calculate duration and total amount when times change
    useEffect(() => {
        if (data.start_time && data.end_time && selectedStudioData) {
            const startTime = new Date(`2024-01-01T${data.start_time}:00`);
            const endTime = new Date(`2024-01-01T${data.end_time}:00`);
            
            if (endTime > startTime) {
                const duration = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
                setData('duration_hours', duration);
                setTotalAmount(selectedStudioData.hourly_rate * duration);
            }
        }
    }, [data.start_time, data.end_time, selectedStudioData, setData]);

    // Update selected studio when studio_id changes
    useEffect(() => {
        if (data.studio_id) {
            const studio = studios.find(s => s.id.toString() === data.studio_id);
            setSelectedStudioData(studio || null);
            if (studio && data.duration_hours) {
                setTotalAmount(studio.hourly_rate * data.duration_hours);
            }
        }
    }, [data.studio_id, data.duration_hours, studios]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'), {
            onSuccess: () => {
                // Redirect handled by controller
            }
        });
    };

    const timeSlots = [];
    for (let hour = 8; hour <= 22; hour++) {
        timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return (
        <AppShell>
            <Head title="Create Booking" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        📅 Create Studio Booking
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Book your preferred studio using our First Come First Served system
                    </p>
                </div>

                {/* FCFS Information */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Icon name="information-circle" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                    ⚡ First Come First Served (FCFS) Booking
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 text-sm mt-1">
                                    Studio slots are allocated based on booking order. Once you submit this form, 
                                    the time slot will be reserved for you. Upload payment proof to confirm your booking.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Booking Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>🎯 Booking Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Studio Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Studio *
                                    </label>
                                    <select
                                        value={data.studio_id}
                                        onChange={(e) => setData('studio_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                                        required
                                    >
                                        <option value="">Select a studio...</option>
                                        {studios.filter(studio => studio.is_active).map((studio) => (
                                            <option key={studio.id} value={studio.id}>
                                                {studio.name} - Rp {studio.hourly_rate.toLocaleString()}/hour
                                            </option>
                                        ))}
                                    </select>
                                    {errors.studio_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.studio_id}</p>
                                    )}
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Booking Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.booking_date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setData('booking_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                                        required
                                    />
                                    {errors.booking_date && (
                                        <p className="text-red-600 text-sm mt-1">{errors.booking_date}</p>
                                    )}
                                </div>

                                {/* Time Selection */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start Time *
                                        </label>
                                        <select
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                                            required
                                        >
                                            <option value="">Start time...</option>
                                            {timeSlots.slice(0, -2).map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.start_time && (
                                            <p className="text-red-600 text-sm mt-1">{errors.start_time}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End Time *
                                        </label>
                                        <select
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                                            required
                                        >
                                            <option value="">End time...</option>
                                            {timeSlots.slice(1).map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {errors.end_time && (
                                            <p className="text-red-600 text-sm mt-1">{errors.end_time}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600"
                                        placeholder="Any special requirements or notes..."
                                    />
                                    {errors.notes && (
                                        <p className="text-red-600 text-sm mt-1">{errors.notes}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>📊 Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedStudioData ? (
                                    <>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {selectedStudioData.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {selectedStudioData.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                                                <span className="font-medium">
                                                    Rp {selectedStudioData.hourly_rate.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                                                <span className="font-medium">
                                                    {data.duration_hours} hour{data.duration_hours !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            {data.booking_date && data.start_time && data.end_time && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
                                                    <span className="font-medium text-right">
                                                        {new Date(data.booking_date).toLocaleDateString()}<br />
                                                        {data.start_time} - {data.end_time}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between pt-2 border-t font-bold text-lg">
                                                <span>Total Amount:</span>
                                                <span className="text-green-600">
                                                    Rp {totalAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                🎛️ Facilities:
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedStudioData.facilities}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Icon name="music-note" className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500">Select a studio to see booking details</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route('studios.index'))}
                        >
                            ← Back to Studios
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={processing || !selectedStudioData || !data.booking_date || !data.start_time || !data.end_time}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {processing ? '⏳ Creating...' : '🎯 Create Booking'}
                        </Button>
                    </div>
                </form>

                {/* Next Steps Info */}
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="pt-6">
                        <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                            📋 Next Steps After Booking:
                        </h3>
                        <ol className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1 list-decimal list-inside">
                            <li>Your booking will be created with "Pending" status</li>
                            <li>Upload payment proof via QRIS or bank transfer</li>
                            <li>Admin will verify your payment</li>
                            <li>Your booking status will change to "Paid"</li>
                            <li>Enjoy your studio session! 🎵</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}