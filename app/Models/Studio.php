<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Studio
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property float $hourly_rate
 * @property string|null $facilities
 * @property string|null $image
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Studio newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio query()
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereFacilities($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereHourlyRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Studio active()
 * @method static \Database\Factories\StudioFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Studio extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'hourly_rate',
        'facilities',
        'image',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope a query to only include active studios.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the bookings for the studio.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if studio is available for a specific date and time slot.
     *
     * @param string $date
     * @param string $startTime
     * @param string $endTime
     * @param int|null $excludeBookingId
     * @return bool
     */
    public function isAvailable(string $date, string $startTime, string $endTime, ?int $excludeBookingId = null): bool
    {
        $query = $this->bookings()
            ->where('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($subQ) use ($startTime, $endTime) {
                      $subQ->where('start_time', '<=', $startTime)
                           ->where('end_time', '>=', $endTime);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->count() === 0;
    }
}