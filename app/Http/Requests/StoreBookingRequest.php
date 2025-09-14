<?php

namespace App\Http\Requests;

use App\Models\Studio;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'studio_id' => ['required', 'exists:studios,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'string', 'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'end_time' => ['required', 'string', 'regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', 'after:start_time'],
            'duration_hours' => ['required', 'integer', 'min:1', 'max:12'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->filled(['studio_id', 'booking_date', 'start_time', 'end_time'])) {
                $studio = Studio::find($this->studio_id);
                
                if ($studio && !$studio->is_active) {
                    $validator->errors()->add('studio_id', 'Selected studio is not available.');
                }
                
                if ($studio && !$studio->isAvailable(
                    $this->booking_date,
                    $this->start_time,
                    $this->end_time
                )) {
                    $validator->errors()->add('start_time', 'The selected time slot is not available.');
                }
            }
        });
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'studio_id.required' => 'Please select a studio.',
            'studio_id.exists' => 'Selected studio does not exist.',
            'booking_date.required' => 'Booking date is required.',
            'booking_date.date' => 'Please provide a valid date.',
            'booking_date.after_or_equal' => 'Booking date cannot be in the past.',
            'start_time.required' => 'Start time is required.',
            'start_time.regex' => 'Please provide a valid start time (HH:MM format).',
            'end_time.required' => 'End time is required.',
            'end_time.regex' => 'Please provide a valid end time (HH:MM format).',
            'end_time.after' => 'End time must be after start time.',
            'duration_hours.required' => 'Duration is required.',
            'duration_hours.integer' => 'Duration must be a whole number.',
            'duration_hours.min' => 'Minimum booking duration is 1 hour.',
            'duration_hours.max' => 'Maximum booking duration is 12 hours.',
        ];
    }
}