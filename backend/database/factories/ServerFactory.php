<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Server>
 */
class ServerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\Server::class;

    public function definition()
    {
        return [
            'name'       => $this->faker->word . '-' . $this->faker->numberBetween(1,5000) . '-' . $this->faker->randomElement(['aws','digitalocean','vultr','other']),
            'ip_address' => $this->faker->ipv4,
            'provider'   => $this->faker->randomElement(['aws','digitalocean','vultr', 'other']),
            'status'     => $this->faker->randomElement(['active','inactive','maintenance']),
            'cpu_cores'  => $this->faker->numberBetween(1, 128),
            'ram_mb'     => $this->faker->numberBetween(512, 1048576),
            'storage_gb' => $this->faker->numberBetween(10, 1048576),
        ];
    }
}
