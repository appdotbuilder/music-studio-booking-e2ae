<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hourly_rate' => 'required|numeric|min:0|max:99999999.99',
            'facilities' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Studio name is required.',
            'hourly_rate.required' => 'Hourly rate is required.',
            'hourly_rate.numeric' => 'Hourly rate must be a valid number.',
            'hourly_rate.min' => 'Hourly rate must be at least 0.',
            'image.image' => 'The uploaded file must be an image.',
            'image.max' => 'Image size cannot exceed 2MB.',
        ];
    }
}