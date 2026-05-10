<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Department;
use App\Models\User;
use App\Models\FacultyProfile;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class ApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('Apply', [
            'departments' => Department::orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'degree' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'cv_file' => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make(Str::random(16)),
        ]);
        
        $user->assignRole('faculty');

        $profile = FacultyProfile::create([
            'user_id' => $user->id,
            'department_id' => $validated['department_id'],
            'degree' => $validated['degree'],
            'specialization' => $validated['specialization'],
            'employment_type' => 'full-time',
            'status' => 'pending',
        ]);

        if ($request->hasFile('cv_file')) {
            $profile->addMediaFromRequest('cv_file')
                ->toMediaCollection('cv', 'local'); // Should use private disk according to requirements
        }

        return redirect()->back()->with('success', 'Application submitted successfully.');
    }
}
