<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ServerResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'ip_address' => $this->ip_address,
            'status' => $this->status,
            'provider' => $this->provider,
            'cpu_cores' => $this->cpu_cores,
            'ram_mb' => $this->ram_mb,
            'storage_gb' => $this->storage_gb,
        ];
    }
}
