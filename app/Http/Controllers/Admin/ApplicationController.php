<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use App\Models\SemesterSignatory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationApproved;
use App\Mail\ApplicationRejected;

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

        $rejectedApplications = FacultyProfile::with(['user', 'department'])
            ->where('status', 'rejected')
            ->latest()
            ->get();

        $stats = [
            'total_pending' => FacultyProfile::where('status', 'pending')->count(),
            'total_approved' => FacultyProfile::where('status', 'approved')->count(),
            'total_rejected' => FacultyProfile::where('status', 'rejected')->count(),
            'total_inactive' => FacultyProfile::where('status', 'inactive')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'applications'   => $applications,
            'approvedFaculty' => $approvedFaculty,
            'rejectedApplications' => $rejectedApplications,
            'departments'    => Department::orderBy('name')->get(),
            'stats'          => $stats,
        ]);
    }

    private function mapDocuments(FacultyProfile $profile): array
    {
        $collections = ['medical_certificates', 'clearances', 'ids', 'nbi_clearance', 'government_ids', 'employment_certificate'];
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
            'must_change_password' => true,
        ]);

        $facultyProfile->update(['status' => 'approved']);
        $facultyProfile->user->assignRole('faculty');

        Mail::to($facultyProfile->user->email)->send(new ApplicationApproved(
            $facultyProfile->user->name,
            $facultyProfile->department->name,
            $facultyProfile->user->email,
            $tempPassword
        ));

        // Save to project root for easy access
        $logFile = base_path('credentials.txt');
        file_put_contents($logFile, "Approved Email: {$facultyProfile->user->email} | Password: {$tempPassword}\n", FILE_APPEND);

        return redirect()->back()->with('credential', [
            'name'     => $facultyProfile->user->name,
            'email'    => $facultyProfile->user->email,
            'password' => $tempPassword,
        ]);
    }

    public function reject(FacultyProfile $facultyProfile)
    {
        $facultyProfile->update(['status' => 'rejected']);

        Mail::to($facultyProfile->user->email)->send(new ApplicationRejected(
            $facultyProfile->user->name,
            $facultyProfile->department->name
        ));

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
            'is_enrolled_graduate' => 'nullable|boolean',
            'grad_school_name' => 'nullable|string|max:255',
            'grad_program' => 'nullable|string|max:255',
            'is_new_hire' => 'nullable|boolean',
            'semester_evaluations' => 'nullable|array',
            'teaching_load_status' => 'nullable|string|max:255',
        ]);

        $tempPassword = Str::random(10);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($tempPassword),
            'must_change_password' => true,
        ]);

        $user->assignRole('faculty');

        FacultyProfile::create([
            'user_id'         => $user->id,
            'department_id'   => $validated['department_id'],
            'degree'          => $validated['degree'],
            'specialization'  => $validated['specialization'],
            'employment_type' => $validated['employment_type'],
            'status'          => 'approved',
            'is_enrolled_graduate' => (bool)($validated['is_enrolled_graduate'] ?? false),
            'grad_school_name' => $validated['grad_school_name'] ?? null,
            'grad_program' => $validated['grad_program'] ?? null,
            'is_new_hire' => (bool)($validated['is_new_hire'] ?? false),
            'semester_evaluations' => $validated['semester_evaluations'] ?? null,
            'teaching_load_status' => $validated['teaching_load_status'] ?? null,
        ]);

        // Save to project root for easy access
        $logFile = base_path('credentials.txt');
        file_put_contents($logFile, "Created Email: {$validated['email']} | Password: {$tempPassword}\n", FILE_APPEND);

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

    /**
     * Preview the print-friendly renewal report grouped by department/program
     */
    public function previewRenewalReport(Request $request)
    {
        $approvedFaculty = FacultyProfile::with(['user', 'department'])
            ->where('status', 'approved')
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->user->name,
                    'department_id' => $profile->department_id,
                    'department_name' => $profile->department->name,
                    'degree' => $profile->degree,
                    'specialization' => $profile->specialization,
                    'employment_type' => $profile->employment_type,
                    'is_enrolled_graduate' => (bool)$profile->is_enrolled_graduate,
                    'grad_school_name' => $profile->grad_school_name,
                    'grad_program' => $profile->grad_program,
                    'is_new_hire' => (bool)$profile->is_new_hire,
                    'semester_evaluations' => $profile->semester_evaluations ?? [],
                    'teaching_load_status' => $profile->teaching_load_status,
                ];
            });

        return Inertia::render('Admin/RenewalReport', [
            'faculty' => $approvedFaculty,
            'departments' => Department::orderBy('name')->get(),
            'signatories' => SemesterSignatory::all(),
        ]);
    }

    /**
     * Save or update signatories for a semester
     */
    public function saveSemesterSignatories(Request $request)
    {
        $validated = $request->validate([
            'semester_code' => 'required|string|max:255',
            'date' => 'nullable|string|max:255',
            'president_name' => 'nullable|string|max:255',
            'president_title' => 'nullable|string|max:255',
            'vpaa_name' => 'nullable|string|max:255',
            'vpaa_title' => 'nullable|string|max:255',
            'sender_name' => 'nullable|string|max:255',
            'sender_title' => 'nullable|string|max:255',
            'recommender_name' => 'nullable|string|max:255',
            'recommender_title' => 'nullable|string|max:255',
            'eval_semesters' => 'nullable|array',
        ]);

        SemesterSignatory::updateOrCreate(
            ['semester_code' => $validated['semester_code']],
            $validated
        );

        return redirect()->back()->with('success', 'Signatory configurations saved successfully.');
    }

    /**
     * Update faculty renewal details
     */
    public function updateRenewal(Request $request, FacultyProfile $facultyProfile)
    {
        $validated = $request->validate([
            'is_enrolled_graduate' => 'required|boolean',
            'grad_school_name' => 'nullable|string|max:255',
            'grad_program' => 'nullable|string|max:255',
            'is_new_hire' => 'required|boolean',
            'semester_evaluations' => 'nullable|array',
            'teaching_load_status' => 'nullable|string|max:255',
        ]);

        $facultyProfile->update($validated);

        return redirect()->back()->with('success', 'Faculty renewal details updated successfully.');
    }

    /**
     * Reset a faculty member's password (admin action)
     */
    public function resetPassword(\Illuminate\Http\Request $request, FacultyProfile $facultyProfile)
    {
        $request->validate(['password' => 'required|string']);

        if (!Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'The provided password does not match our records.']);
        }

        $tempPassword = Str::random(10);

        $facultyProfile->user->update([
            'password' => Hash::make($tempPassword),
            'must_change_password' => true,
        ]);

        $logFile = base_path('credentials.txt');
        file_put_contents($logFile, "Reset Email: {$facultyProfile->user->email} | Password: {$tempPassword}\n", FILE_APPEND);

        return redirect()->back()->with('credential', [
            'name'     => $facultyProfile->user->name,
            'email'    => $facultyProfile->user->email,
            'password' => $tempPassword,
        ]);
    }

    /**
     * Move a rejected application back to pending for re-review
     */
    public function reReview(FacultyProfile $facultyProfile)
    {
        $facultyProfile->update(['status' => 'pending']);

        return redirect()->back()->with('success', 'Application moved back to pending for re-review.');
    }

    /**
     * Permanently delete a rejected application
     */
    public function deleteApplication(FacultyProfile $facultyProfile)
    {
        $user = $facultyProfile->user;
        $facultyProfile->delete();
        $user->delete();

        return redirect()->back()->with('success', 'Application permanently deleted.');
    }

    /**
     * Check compliance status for all approved faculty before batch download
     */
    public function checkBatchCompliance()
    {
        $requiredCollections = ['medical_certificates', 'clearances', 'ids', 'nbi_clearance', 'government_ids', 'employment_certificate'];
        $collectionLabels = [
            'medical_certificates' => 'Medical Certificates',
            'clearances' => 'Clearances',
            'ids' => 'Identification Documents',
            'nbi_clearance' => 'NBI Clearance',
            'government_ids' => 'TIN/SSS/PhilHealth/Pag-IBIG',
            'employment_certificate' => 'Certificate of Employment',
        ];

        $faculty = FacultyProfile::with(['user', 'media'])
            ->where('status', 'approved')
            ->get();

        $incompleteList = [];
        $compliantCount = 0;

        foreach ($faculty as $profile) {
            $missing = [];
            foreach ($requiredCollections as $collection) {
                if ($profile->getMedia($collection)->count() === 0) {
                    $missing[] = $collectionLabels[$collection];
                }
            }
            if (count($missing) > 0) {
                $incompleteList[] = [
                    'name' => $profile->user->name,
                    'missing' => $missing,
                ];
            } else {
                $compliantCount++;
            }
        }

        return response()->json([
            'total' => $faculty->count(),
            'compliant' => $compliantCount,
            'incomplete' => $incompleteList,
        ]);
    }

    /**
     * Batch download all documents for compliant faculty as a ZIP
     */
    public function batchDownload()
    {
        $requiredCollections = ['medical_certificates', 'clearances', 'ids', 'nbi_clearance', 'government_ids', 'employment_certificate'];

        $faculty = FacultyProfile::with(['user', 'media'])
            ->where('status', 'approved')
            ->get();

        // Only include fully compliant faculty
        $compliantFaculty = $faculty->filter(function ($profile) use ($requiredCollections) {
            foreach ($requiredCollections as $collection) {
                if ($profile->getMedia($collection)->count() === 0) {
                    return false;
                }
            }
            return true;
        });

        if ($compliantFaculty->isEmpty()) {
            return redirect()->back()->with('error', 'No fully compliant faculty to download.');
        }

        $zipFileName = 'Faculty_Documents_' . now()->format('Y-m-d_His') . '.zip';
        $zipPath = storage_path('app/' . $zipFileName);

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return redirect()->back()->with('error', 'Could not create ZIP file.');
        }

        $collectionLabels = [
            'medical_certificates' => 'Medical Certificates',
            'clearances' => 'Clearances',
            'ids' => 'Identification Documents',
            'nbi_clearance' => 'NBI Clearance',
            'government_ids' => 'TIN-SSS-PhilHealth-PagIBIG',
            'employment_certificate' => 'Certificate of Employment',
        ];

        foreach ($compliantFaculty as $profile) {
            $folderName = preg_replace('/[^A-Za-z0-9\-_ ]/', '', $profile->user->name);
            foreach ($requiredCollections as $collection) {
                $media = $profile->getMedia($collection);
                foreach ($media as $item) {
                    $subFolder = $collectionLabels[$collection] ?? $collection;
                    $diskName = $item->disk ?: env('MEDIA_DISK', 'local');
                    
                    if ($diskName === 'local' || $diskName === 'public') {
                        $filePath = $item->getPath();
                        if (file_exists($filePath)) {
                            $zip->addFile($filePath, "{$folderName}/{$subFolder}/{$item->file_name}");
                        }
                    } else {
                        $disk = \Illuminate\Support\Facades\Storage::disk($diskName);
                        $relativePath = $item->getPath();
                        if ($disk->exists($relativePath)) {
                            $zip->addFromString("{$folderName}/{$subFolder}/{$item->file_name}", $disk->get($relativePath));
                        }
                    }
                }
            }
        }

        $zip->close();

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }
}
