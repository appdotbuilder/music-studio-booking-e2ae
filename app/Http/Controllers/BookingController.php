<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Http\Requests\UploadPaymentProofRequest;
use App\Models\Booking;
use App\Models\Studio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['studio', 'user']);

        // Admin sees all bookings, customers see only their own
        if (!auth()->user()->isAdmin()) {
            $query->where('user_id', auth()->id());
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('booking_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('booking_date', '<=', $request->date_to);
        }

        // Search by user name or studio name (admin only)
        if ($request->filled('search') && auth()->user()->isAdmin()) {
            $query->where(function($q) use ($request) {
                $q->whereHas('user', function($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->search . '%');
                })->orWhereHas('studio', function($studioQuery) use ($request) {
                    $studioQuery->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        $bookings = $query->latest()->paginate(10);

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $studios = Studio::active()->get();
        $selectedStudio = null;

        if ($request->filled('studio_id')) {
            $selectedStudio = Studio::active()->find($request->studio_id);
        }

        return Inertia::render('bookings/create', [
            'studios' => $studios,
            'selectedStudio' => $selectedStudio
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Get studio and calculate total amount
        $studio = Studio::findOrFail($data['studio_id']);
        $data['total_amount'] = $studio->hourly_rate * $data['duration_hours'];

        $booking = Booking::create($data);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking created successfully. Please upload payment proof to confirm your booking.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        // Check authorization
        if (!auth()->user()->isAdmin() && $booking->user_id !== auth()->id()) {
            abort(403);
        }

        $booking->load(['studio', 'user', 'verifier']);

        return Inertia::render('bookings/show', [
            'booking' => $booking
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        // Only allow editing if booking is pending and user owns it
        if ($booking->status !== 'pending' || 
            (!auth()->user()->isAdmin() && $booking->user_id !== auth()->id())) {
            abort(403);
        }

        $studios = Studio::active()->get();

        return Inertia::render('bookings/edit', [
            'booking' => $booking,
            'studios' => $studios
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreBookingRequest $request, Booking $booking)
    {
        // Only allow editing if booking is pending and user owns it
        if ($booking->status !== 'pending' || 
            (!auth()->user()->isAdmin() && $booking->user_id !== auth()->id())) {
            abort(403);
        }

        $data = $request->validated();
        
        // Recalculate total amount if studio or duration changed
        if ($data['studio_id'] !== $booking->studio_id || 
            $data['duration_hours'] !== $booking->duration_hours) {
            $studio = Studio::findOrFail($data['studio_id']);
            $data['total_amount'] = $studio->hourly_rate * $data['duration_hours'];
        }

        $booking->update($data);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        // Only allow deletion if booking is pending/cancelled and user owns it or user is admin
        if (!in_array($booking->status, ['pending', 'cancelled']) ||
            (!auth()->user()->isAdmin() && $booking->user_id !== auth()->id())) {
            abort(403);
        }

        // Delete payment proof if exists
        if ($booking->payment_proof) {
            Storage::disk('public')->delete($booking->payment_proof);
        }

        $booking->delete();

        return redirect()->route('bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }


}