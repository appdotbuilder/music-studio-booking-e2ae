<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\StudioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page shows studios for booking
Route::get('/', [StudioController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        
        if ($user->isAdmin()) {
            $totalBookings = \App\Models\Booking::count();
            $pendingBookings = \App\Models\Booking::pending()->count();
            $todayBookings = \App\Models\Booking::whereDate('booking_date', today())->count();
            $totalRevenue = \App\Models\Booking::where('status', 'completed')->sum('total_amount');
            
            return Inertia::render('admin/dashboard', [
                'stats' => [
                    'totalBookings' => $totalBookings,
                    'pendingBookings' => $pendingBookings,
                    'todayBookings' => $todayBookings,
                    'totalRevenue' => $totalRevenue,
                ]
            ]);
        }
        
        $recentBookings = $user->bookings()->with('studio')->latest()->take(5)->get();
        $upcomingBookings = $user->bookings()
            ->with('studio')
            ->where('booking_date', '>=', today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('booking_date')
            ->take(3)
            ->get();
        
        return Inertia::render('customer/dashboard', [
            'recentBookings' => $recentBookings,
            'upcomingBookings' => $upcomingBookings,
        ]);
    })->name('dashboard');

    // Admin dashboard
    Route::get('admin/dashboard', function () {
        $totalBookings = \App\Models\Booking::count();
        $pendingBookings = \App\Models\Booking::pending()->count();
        $todayBookings = \App\Models\Booking::whereDate('booking_date', today())->count();
        $totalRevenue = \App\Models\Booking::where('status', 'completed')->sum('total_amount');
        
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalBookings' => $totalBookings,
                'pendingBookings' => $pendingBookings,
                'todayBookings' => $todayBookings,
                'totalRevenue' => $totalRevenue,
            ]
        ]);
    })->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->name('admin.dashboard');

    // Customer dashboard
    Route::get('customer/dashboard', function () {
        $user = auth()->user();
        $recentBookings = $user->bookings()->with('studio')->latest()->take(5)->get();
        $upcomingBookings = $user->bookings()
            ->with('studio')
            ->where('booking_date', '>=', today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('booking_date')
            ->take(3)
            ->get();
        
        return Inertia::render('customer/dashboard', [
            'recentBookings' => $recentBookings,
            'upcomingBookings' => $upcomingBookings,
        ]);
    })->name('customer.dashboard');

    // Studio routes
    Route::resource('studios', StudioController::class);

    // Booking routes
    Route::resource('bookings', BookingController::class);
    
    // Additional booking routes
    Route::post('bookings/{booking}/payment', [\App\Http\Controllers\BookingPaymentController::class, 'store'])
        ->name('bookings.payment.store');
    Route::patch('bookings/{booking}/status', [\App\Http\Controllers\BookingStatusController::class, 'update'])
        ->name('bookings.status.update');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';