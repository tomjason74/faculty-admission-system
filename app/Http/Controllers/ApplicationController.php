<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Department;
use App\Models\User;
use App\Models\FacultyProfile;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationReceived;

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
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|max:255|unique:users,email',
            'phone'           => 'required|string|max:30',
            'address'         => 'nullable|string|max:500',
            'degree'          => 'required|string|max:255',
            'specialization'  => 'required|string|max:255',
            'department_id'   => 'required|exists:departments,id',
            'employment_type' => 'required|in:full-time,part-time,contract',
            'cover_message'   => 'nullable|string|max:3000',
            'cv_file'         => 'required|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Create a system-managed user account (applicant won't log in until approved)
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make(Str::random(16)),
        ]);

        $profile = FacultyProfile::create([
            'user_id'         => $user->id,
            'department_id'   => $validated['department_id'],
            'degree'          => $validated['degree'],
            'specialization'  => $validated['specialization'],
            'employment_type' => $validated['employment_type'],
            'status'          => 'pending',
        ]);

        if ($request->hasFile('cv_file')) {
            $profile->addMediaFromRequest('cv_file')
                ->toMediaCollection('cv', 'local');
        }

        Mail::to($user->email)->send(new ApplicationReceived(
            $user->name,
            Department::find($validated['department_id'])->name
        ));

        return redirect()->back()->with('success', 'Application submitted successfully.');
    }
}
