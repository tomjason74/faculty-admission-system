<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index()
    {
        $applications = FacultyProfile::with(['user', 'department', 'media'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        $applications->transform(function ($app) {
            $cvMedia = $app->getFirstMedia('cv');
            $app->cv_url = $cvMedia ? route('documents.download', $cvMedia->id) : null;
            $app->documents = $this->mapDocuments($app);
            return $app;
        });

        $approvedFaculty = FacultyProfile::with(['user', 'department', 'media'])
            ->whereIn('status', ['approved', 'inactive'])
            ->latest()
            ->get()
            ->map(function ($faculty) {
                $faculty->class_records = $faculty->getMedia('class_records')->map(function ($m) {
                    return [
                        'id' => $m->id,
                        'file_name' => $m->file_name,
                        'semester' => $m->getCustomProperty('semester'),
                        'course_code' => $m->getCustomProperty('course_code'),
                    ];
                });
                $cvMedia = $faculty->getFirstMedia('cv');
                $faculty->cv_url = $cvMedia ? route('documents.download', $cvMedia->id) : null;
                $faculty->documents = $this->mapDocuments($faculty);
                return $faculty;
            });

        return Inertia::render('Admin/Dashboard', [
            'applications'   => $applications,
            'approvedFaculty' => $approvedFaculty,
            'departments'    => Department::orderBy('name')->get(),
        ]);
    }

    private function mapDocuments(FacultyProfile $profile): array
    {
        $collections = ['medical_certificates', 'clearances', 'ids'];
        $result = [];
        foreach ($collections as $collection) {
            $result[$collection] = $profile->getMedia($collection)->map(fn ($m) => [
                'id' => $m->id,
                'file_name' => $m->file_name,
                'mime_type' => $m->mime_type,
            ])->values();
        }
        return $result;
    }

    /**
     * Admin approves a pending faculty application.
     * Generates a temp password and returns it in the session flash.
     */
    public function approve(FacultyProfile $facultyProfile)
    {
        $tempPassword = Str::random(10);

        $facultyProfile->user->update([
            'password' => Hash::make($tempPassword),
        ]);

        $facultyProfile->update(['status' => 'approved']);
        $facultyProfile->user->assignRole('faculty');

        return redirect()->back()->with('credential', [
            'name'     => $facultyProfile->user->name,
            'email'    => $facultyProfile->user->email,
            'password' => $tempPassword,
        ]);
    }

    public function reject(FacultyProfile $facultyProfile)
    {
        $facultyProfile->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Application rejected.');
    }

    /**
     * Admin manually creates a faculty account directly (bypasses application flow).
     */
    public function storeFaculty(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|max:255|unique:users,email',
            'department_id'   => 'required|exists:departments,id',
            'degree'          => 'required|string|max:255',
            'specialization'  => 'required|string|max:255',
            'employment_type' => 'required|in:full-time,part-time,contract',
        ]);

        $tempPassword = Str::random(10);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($tempPassword),
        ]);

        $user->assignRole('faculty');

        FacultyProfile::create([
            'user_id'         => $user->id,
            'department_id'   => $validated['department_id'],
            'degree'          => $validated['degree'],
            'specialization'  => $validated['specialization'],
            'employment_type' => $validated['employment_type'],
            'status'          => 'approved',
        ]);

        return redirect()->back()->with('credential', [
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => $tempPassword,
        ]);
    }

    /**
     * Deactivate a faculty account (Offboarding)
     */
    public function deactivate(\Illuminate\Http\Request $request, FacultyProfile $facultyProfile)
    {
        $request->validate(['password' => 'required|string']);
        
        if (!\Illuminate\Support\Facades\Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'The provided password does not match our records.']);
        }

        $facultyProfile->update(['status' => 'inactive']);
        
        // Remove roles/permissions so they can't login
        $facultyProfile->user->removeRole('faculty');

        return redirect()->back()->with('success', 'Faculty account has been deactivated.');
    }

    /**
     * Reactivate a faculty account
     */
    public function reactivate(FacultyProfile $facultyProfile)
    {
        $facultyProfile->update(['status' => 'approved']);
        
        // Restore login access
        $facultyProfile->user->assignRole('faculty');

        return redirect()->back()->with('success', 'Faculty account has been reactivated.');
    }
}
