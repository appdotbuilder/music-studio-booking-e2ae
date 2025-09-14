<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudioRequest;
use App\Http\Requests\UpdateStudioRequest;
use App\Models\Studio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Studio::query();

        // Filter by active status if requested
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        } else {
            // Default to active studios for customers
            if (!auth()->user()?->isAdmin()) {
                $query->active();
            }
        }

        // Search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $studios = $query->latest()->paginate(12);

        return Inertia::render('studios/index', [
            'studios' => $studios,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }

        return Inertia::render('studios/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudioRequest $request)
    {
        $data = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('studios', 'public');
        }

        $studio = Studio::create($data);

        return redirect()->route('studios.show', $studio)
            ->with('success', 'Studio created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Studio $studio)
    {
        // Load bookings for availability checking
        $studio->load(['bookings' => function($query) {
            $query->where('booking_date', '>=', now()->toDateString())
                  ->where('status', '!=', 'cancelled')
                  ->orderBy('booking_date')
                  ->orderBy('start_time');
        }]);

        return Inertia::render('studios/show', [
            'studio' => $studio
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Studio $studio)
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }

        return Inertia::render('studios/edit', [
            'studio' => $studio
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudioRequest $request, Studio $studio)
    {
        $data = $request->validated();
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($studio->image) {
                Storage::disk('public')->delete($studio->image);
            }
            $data['image'] = $request->file('image')->store('studios', 'public');
        }

        $studio->update($data);

        return redirect()->route('studios.show', $studio)
            ->with('success', 'Studio updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Studio $studio)
    {
        if (!auth()->user()?->isAdmin()) {
            abort(403, 'Access denied. Admin privileges required.');
        }

        // Check if studio has active bookings
        $hasActiveBookings = $studio->bookings()
            ->whereIn('status', ['pending', 'paid'])
            ->exists();

        if ($hasActiveBookings) {
            return redirect()->route('studios.index')
                ->with('error', 'Cannot delete studio with active bookings.');
        }

        // Delete image if exists
        if ($studio->image) {
            Storage::disk('public')->delete($studio->image);
        }

        $studio->delete();

        return redirect()->route('studios.index')
            ->with('success', 'Studio deleted successfully.');
    }
}