<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
            return [
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('servers')->where(function ($query) {
                        return $query->where('provider', $this->provider);
                    }),
                ],
                'ip_address' => 'required|ip|unique:servers,ip_address',
                'status' => 'required|in:active,inactive,maintenance',
                'provider' => 'required|in:aws,digitalocean,vultr,other',
                'cpu_cores' => 'required|integer|min:1|max:128',
                'ram_mb' => 'required|integer|min:512|max:1048576',
                'storage_gb' => 'required|integer|min:10|max:1048576',
            ];
    }
}
