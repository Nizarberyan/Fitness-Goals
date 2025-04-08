<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GoalController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json(Auth::user()->goals, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'progress' => 'required|integer|min:0|max:100',
        ]);

        $goal = Auth::user()->goals()->create($validated);
        return response()->json($goal, 201);
    }

    public function show($id) {
        $goal = Goal::find($id);
        return response()->json($goal, 200);
    }
    public function update(Request $request, $id)
    {
        $goal = Auth::user()->goals()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'progress' => 'sometimes|integer|min:0|max:100',
        ]);

        $goal->update($validated);
        return response()->json($goal, 200);
    }

    public function destroy($id)
    {
        $goal = Auth::user()->goals()->findOrFail($id);
        $goal->delete();
        return response()->json(['message' => 'Goal deleted'], 200);
    }
}

