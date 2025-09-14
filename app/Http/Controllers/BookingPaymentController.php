<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadPaymentProofRequest;
use App\Models\Booking;
use Illuminate\Support\Facades\Storage;

class BookingPaymentController extends Controller
{
    /**
     * Store payment proof for a booking.
     */
    public function store(UploadPaymentProofRequest $request, Booking $booking)
    {
        if ($booking->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Cannot upload payment proof for this booking.');
        }

        $data = $request->validated();

        // Delete old payment proof if exists
        if ($booking->payment_proof) {
            Storage::disk('public')->delete($booking->payment_proof);
        }

        // Store new payment proof
        $data['payment_proof'] = $request->file('payment_proof')->store('payment-proofs', 'public');

        $booking->update($data);

        return redirect()->route('bookings.show', $booking)
            ->with('success', 'Payment proof uploaded successfully. Waiting for admin verification.');
    }
}