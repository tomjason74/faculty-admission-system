<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->facultyProfile()->with('media')->first();

        // Separate media by collections for the frontend
        $documents = [
            'medical_certificates' => $profile ? $profile->getMedia('medical_certificates')->map(fn($m) => ['id' => $m->id, 'file_name' => $m->file_name]) : [],
            'clearances' => $profile ? $profile->getMedia('clearances')->map(fn($m) => ['id' => $m->id, 'file_name' => $m->file_name]) : [],
            'ids' => $profile ? $profile->getMedia('ids')->map(fn($m) => ['id' => $m->id, 'file_name' => $m->file_name]) : [],
        ];

        $classRecords = $profile ? $profile->getMedia('class_records')->map(function ($m) {
            return [
                'id' => $m->id,
                'file_name' => $m->file_name,
                'semester' => $m->getCustomProperty('semester'),
                'course_code' => $m->getCustomProperty('course_code'),
            ];
        }) : [];

        return Inertia::render('Faculty/Dashboard', [
            'profile' => $profile,
            'documents' => $documents,
            'classRecords' => $classRecords,
        ]);
    }

    public function storeDocument(Request $request)
    {
        $request->validate([
            'collection' => 'required|in:medical_certificates,clearances,ids',
            'file' => 'required|file|max:10240',
        ]);

        $profile = $request->user()->facultyProfile;

        if (!$profile) {
            return redirect()->back()->with('error', 'Profile not found.');
        }

        $profile->addMediaFromRequest('file')->toMediaCollection($request->collection, 'local');

        return redirect()->back()->with('success', 'Document uploaded successfully.');
    }

    public function storeClassRecord(Request $request)
    {
        $request->validate([
            'semester' => 'required|string|max:255',
            'course_code' => 'required|string|max:255',
            'file' => 'required|file|max:10240',
        ]);

        $profile = $request->user()->facultyProfile;

        if (!$profile) {
            return redirect()->back()->with('error', 'Profile not found.');
        }

        $profile->addMediaFromRequest('file')
            ->withCustomProperties([
                'semester' => $request->semester,
                'course_code' => $request->course_code,
            ])
            ->toMediaCollection('class_records', 'local');

        return redirect()->back()->with('success', 'Class record uploaded successfully.');
    }
}
