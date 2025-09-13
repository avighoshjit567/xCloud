<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Server;

class ServerSeeder extends Seeder
{
    public function run()
    {
        // You must have a ServerFactory for this to work
        Server::factory()->count(200)->create();
    }
}
