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
    public function list(Request $request)
    {
        $query = Server::query();

        // Filtering
        if ($request->has('provider')) {
            $query->where('provider', $request->provider);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('cpu_cores')) {
            $query->where('cpu_cores', $request->cpu_cores);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('ip_address', 'like', "%$search%")
                  ->orWhere('provider', 'like', "%$search%")
                  ->orWhere('status', 'like', "%$search%")
                  ->orWhere('cpu_cores', 'like', "%$search%")
                  ->orWhere('ram_mb', 'like', "%$search%")
                  ->orWhere('storage_gb', 'like', "%$search%") ;
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $servers = $query->paginate($perPage);

        return response()->json([
            'message' => 'Servers retrieved successfully',
            'servers' => ServerResource::collection($servers),
            'pagination' => [
                'total' => $servers->total(),
                'per_page' => $servers->perPage(),
                'current_page' => $servers->currentPage(),
                'last_page' => $servers->lastPage(),
                'from' => $servers->firstItem(),
                'to' => $servers->lastItem(),
            ],
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