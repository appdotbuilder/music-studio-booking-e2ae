<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Studio;
use App\Models\Booking;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'phone' => '081234567890',
        ]);

        // Create test customer
        $customer = User::factory()->customer()->create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'phone' => '081234567891',
        ]);

        // Create additional customers
        User::factory()->customer()->count(10)->create();

        // Create studios
        $studios = collect([
            [
                'name' => 'Premium Recording Studio A',
                'description' => 'State-of-the-art recording studio with professional equipment and acoustic treatment. Perfect for album recording, voiceovers, and music production.',
                'hourly_rate' => 300.00,
                'facilities' => 'Professional microphones, High-end DAW, Premium monitors, Acoustic treatment, Instruments, Climate control, Wi-Fi, Coffee machine',
                'is_active' => true,
            ],
            [
                'name' => 'Rehearsal Room B',
                'description' => 'Spacious rehearsal room suitable for band practice and live recording sessions. Great acoustics and comfortable environment.',
                'hourly_rate' => 150.00,
                'facilities' => 'Drum kit, Guitar amplifiers, Bass amplifier, Microphones, Monitor speakers, Air conditioning',
                'is_active' => true,
            ],
            [
                'name' => 'Production Studio C',
                'description' => 'Modern production studio equipped with latest technology for mixing and mastering. Ideal for post-production work.',
                'hourly_rate' => 250.00,
                'facilities' => 'Professional DAW, Mixing console, Studio monitors, Audio interfaces, MIDI controllers, Acoustic treatment',
                'is_active' => true,
            ],
            [
                'name' => 'Budget Practice Room D',
                'description' => 'Affordable practice room for solo artists and small bands. Basic equipment but great value.',
                'hourly_rate' => 75.00,
                'facilities' => 'Basic amplifiers, Microphones, Monitor speakers, Air conditioning, Wi-Fi',
                'is_active' => true,
            ],
            [
                'name' => 'Live Recording Studio E',
                'description' => 'Large studio perfect for live band recordings and video sessions. Professional lighting and multiple camera angles available.',
                'hourly_rate' => 400.00,
                'facilities' => 'Multi-track recording, Video equipment, Professional lighting, Multiple microphones, Live monitoring, Green room',
                'is_active' => true,
            ]
        ]);

        $createdStudios = $studios->map(function ($studioData) {
            return Studio::create($studioData);
        });

        // Create additional random studios
        Studio::factory()->count(5)->create();

        // Create sample bookings
        $allStudios = Studio::all();
        $allCustomers = User::customer()->get();

        // Create bookings with various statuses
        foreach ($allCustomers->take(5) as $customer) {
            $studio = $allStudios->random();
            
            // Pending booking (needs payment)
            Booking::factory()->pending()->create([
                'user_id' => $customer->id,
                'studio_id' => $studio->id,
                'booking_date' => now()->addDays(random_int(1, 7))->toDateString(),
            ]);

            // Paid booking (payment verified)
            Booking::factory()->paid()->create([
                'user_id' => $customer->id,
                'studio_id' => $allStudios->random()->id,
                'booking_date' => now()->addDays(random_int(8, 15))->toDateString(),
                'verified_by' => $admin->id,
            ]);

            // Completed booking (past)
            Booking::factory()->completed()->create([
                'user_id' => $customer->id,
                'studio_id' => $allStudios->random()->id,
                'booking_date' => now()->subDays(random_int(1, 30))->toDateString(),
                'verified_by' => $admin->id,
            ]);
        }

        // Create additional random bookings
        Booking::factory()->count(15)->create();
    }
}