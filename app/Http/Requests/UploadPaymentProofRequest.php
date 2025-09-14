<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadPaymentProofRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $booking = $this->route('booking');
        return auth()->check() && auth()->id() === $booking->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_proof' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048' // 2MB max
            ],
            'payment_method' => [
                'required',
                'string',
                Rule::in(['qris', 'transfer'])
            ],
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
            'payment_proof.required' => 'Payment proof image is required.',
            'payment_proof.image' => 'Payment proof must be an image file.',
            'payment_proof.mimes' => 'Payment proof must be in JPEG, PNG, JPG, or GIF format.',
            'payment_proof.max' => 'Payment proof image cannot exceed 2MB.',
            'payment_method.required' => 'Payment method is required.',
            'payment_method.in' => 'Invalid payment method selected.',
        ];
    }
}