<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Studio>
 */
class StudioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $studioTypes = ['Recording', 'Rehearsal', 'Production', 'Mix & Master', 'Live Room'];
        $facilities = [
            'Professional microphones',
            'Digital audio workstation',
            'Mixing console',
            'Monitor speakers',
            'Acoustic treatment',
            'Instruments available',
            'Air conditioning',
            'Wi-Fi',
        ];

        return [
            'name' => fake()->randomElement($studioTypes) . ' Studio ' . fake()->randomLetter(),
            'description' => fake()->paragraph(3),
            'hourly_rate' => fake()->randomFloat(2, 50, 500),
            'facilities' => implode(', ', fake()->randomElements($facilities, random_int(3, 6))),
            'is_active' => fake()->boolean(90), // 90% chance of being active
        ];
    }

    /**
     * Indicate that the studio is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the studio is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'hourly_rate' => fake()->randomFloat(2, 300, 800),
            'name' => 'Premium ' . fake()->randomElement(['Recording', 'Production']) . ' Studio',
            'facilities' => 'Professional microphones, High-end DAW, Premium monitors, Acoustic treatment, Instruments, Climate control, Wi-Fi, Coffee machine',
        ]);
    }

    /**
     * Indicate that the studio is budget-friendly.
     */
    public function budget(): static
    {
        return $this->state(fn (array $attributes) => [
            'hourly_rate' => fake()->randomFloat(2, 25, 75),
            'name' => 'Budget ' . fake()->randomElement(['Rehearsal', 'Practice']) . ' Room',
        ]);
    }
}