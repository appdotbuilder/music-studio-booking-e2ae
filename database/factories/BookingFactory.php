<?php

namespace Database\Factories;

use App\Models\Studio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startHour = random_int(9, 20); // 9 AM to 8 PM
        $duration = random_int(1, 4); // 1-4 hours
        $startTime = sprintf('%02d:00', $startHour);
        $endTime = sprintf('%02d:00', $startHour + $duration);

        $studio = Studio::factory()->create();
        $totalAmount = $studio->hourly_rate * $duration;

        return [
            'user_id' => User::factory()->create(['role' => 'customer']),
            'studio_id' => $studio->id,
            'booking_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_hours' => $duration,
            'total_amount' => $totalAmount,
            'status' => fake()->randomElement(['pending', 'paid', 'cancelled', 'completed']),
            'payment_method' => fake()->randomElement(['qris', 'transfer']),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the booking is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_method' => null,
            'payment_proof' => null,
            'verified_at' => null,
            'verified_by' => null,
        ]);
    }

    /**
     * Indicate that the booking is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'payment_method' => fake()->randomElement(['qris', 'transfer']),
            'payment_proof' => 'payment_proof_' . fake()->uuid() . '.jpg',
            'verified_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'verified_by' => User::factory()->create(['role' => 'admin']),
        ]);
    }

    /**
     * Indicate that the booking is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_method' => fake()->randomElement(['qris', 'transfer', 'cash']),
            'verified_at' => fake()->dateTimeBetween('-7 days', 'now'),
            'verified_by' => User::factory()->create(['role' => 'admin']),
        ]);
    }

    /**
     * Indicate that the booking is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_method' => null,
            'payment_proof' => null,
            'verified_at' => null,
            'verified_by' => null,
        ]);
    }
}