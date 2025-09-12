<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreServerRequest;
use App\Http\Resources\ServerResource;
use App\Models\Server;

class ServerController extends Controller
{
    // function for create server
    public function create(StoreServerRequest $request) 
    {
        $data = $request->all();    

        $server = Server::create($data);

        return response()->json([
            'server' => new ServerResource($server),
        ], 201);
    }

    // function for list all servers
    public function list() 
    {
        $servers = Server::all();

        return response()->json([
            'message' => 'Servers retrieved successfully',
            'servers' => ServerResource::collection($servers),
            'status' => 200,
        ]);
    }

    // function for show single server
    public function show($id) 
    {
        $server = Server::find($id);
        if (!$server) {
            return response()->json([
                'message' => 'Server not found',
                'status' => 404,
            ]);
        }

        return response()->json([
            'message' => 'Server retrieved successfully',
            'server' => new ServerResource($server),
            'status' => 200,
        ]);
    }

    // function for edit server
    public function update(StoreServerRequest $request, $id) 
    {
        $server = Server::find($id);

        if (!$server) {
            return response()->json([
                'message' => 'Server not found',
                'status' => 404,
            ]);
        }

        $data = $request->all();
        $server->update($data);

        return response()->json([
            'message' => 'Server updated successfully',
            'server' => new ServerResource($server),
            'status' => 200,
        ]);
    }

    // function for delete server
    public function delete($id) 
    {
        $server = Server::find($id);
        if (!$server) {
            return response()->json([
                'message' => 'Server not found',
                'status' => 404,
            ]);
        }

        $server->delete();

        return response()->json([
            'message' => 'Server deleted successfully',
            'status' => 200,
        ]);
    }

    // function for bulk delete servers
    public function bulkDelete(Request $request)
    {
        $ids = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer'
        ])['ids'];

        Server::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Servers deleted successfully',
            'status' => 200,
        ]);
    }
}