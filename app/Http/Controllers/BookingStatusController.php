<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Models\Booking;

class BookingStatusController extends Controller
{
    /**
     * Update booking status (admin only).
     */
    public function update(UpdateBookingStatusRequest $request, Booking $booking)
    {
        $data = $request->validated();
        
        // Set verification details for paid/completed status
        if (in_array($data['status'], ['paid', 'completed'])) {
            $data['verified_at'] = now();
            $data['verified_by'] = auth()->id();
        }

        $booking->update($data);

        $statusMessages = [
            'paid' => 'Booking payment verified successfully.',
            'completed' => 'Booking marked as completed.',
            'cancelled' => 'Booking cancelled.',
            'pending' => 'Booking status updated to pending.'
        ];

        $message = $statusMessages[$data['status']] ?? 'Booking status updated.';

        return redirect()->route('bookings.show', $booking)
            ->with('success', $message);
    }
}