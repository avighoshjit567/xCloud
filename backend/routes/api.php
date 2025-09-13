<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ServerController;
use App\Http\Middleware\EnsureTokenIsValid;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test', function(){
    return response()->json([
        'message' => 'Hellow From xCloud!',
        'status' => true
    ], 200);
});

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::prefix('server')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('create', [ServerController::class, 'create']);
    Route::get('list', [ServerController::class, 'list']);
    Route::get('{id}', [ServerController::class, 'show']);
    Route::put('{id}', [ServerController::class, 'update']);
    Route::delete('{id}', [ServerController::class, 'delete']);
    Route::post('/bulk-delete', [ServerController::class, 'bulkDelete']);
});