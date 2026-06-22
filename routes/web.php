<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/apply', [\App\Http\Controllers\ApplicationController::class, 'create'])->name('apply.create');
Route::post('/apply', [\App\Http\Controllers\ApplicationController::class, 'store'])->name('apply.store');

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\ApplicationController::class, 'index'])->name('dashboard');
    Route::post('/applications/{facultyProfile}/approve', [\App\Http\Controllers\Admin\ApplicationController::class, 'approve'])->name('applications.approve');
    Route::post('/applications/{facultyProfile}/reject', [\App\Http\Controllers\Admin\ApplicationController::class, 'reject'])->name('applications.reject');
    Route::post('/faculty', [\App\Http\Controllers\Admin\ApplicationController::class, 'storeFaculty'])->name('faculty.store');
    Route::post('/faculty/{facultyProfile}/deactivate', [\App\Http\Controllers\Admin\ApplicationController::class, 'deactivate'])->name('faculty.deactivate');
    Route::post('/faculty/{facultyProfile}/reactivate', [\App\Http\Controllers\Admin\ApplicationController::class, 'reactivate'])->name('faculty.reactivate');
    Route::get('/reports/renewal', [\App\Http\Controllers\Admin\ApplicationController::class, 'previewRenewalReport'])->name('reports.renewal');
    Route::post('/reports/renewal/signatories', [\App\Http\Controllers\Admin\ApplicationController::class, 'saveSemesterSignatories'])->name('reports.renewal.signatories');
    Route::post('/faculty/{facultyProfile}/update-renewal', [\App\Http\Controllers\Admin\ApplicationController::class, 'updateRenewal'])->name('faculty.update_renewal');
    Route::get('/faculty/import-template', [\App\Http\Controllers\Admin\BulkImportController::class, 'downloadTemplate'])->name('faculty.import_template');
    Route::post('/faculty/import', [\App\Http\Controllers\Admin\BulkImportController::class, 'import'])->name('faculty.import');
    Route::post('/faculty/{facultyProfile}/reset-password', [\App\Http\Controllers\Admin\ApplicationController::class, 'resetPassword'])->name('faculty.reset_password');
    Route::post('/applications/{facultyProfile}/re-review', [\App\Http\Controllers\Admin\ApplicationController::class, 'reReview'])->name('applications.re_review');
    Route::delete('/applications/{facultyProfile}', [\App\Http\Controllers\Admin\ApplicationController::class, 'deleteApplication'])->name('applications.delete');
    Route::get('/faculty/batch-compliance', [\App\Http\Controllers\Admin\ApplicationController::class, 'checkBatchCompliance'])->name('faculty.batch_compliance');
    Route::get('/faculty/batch-download', [\App\Http\Controllers\Admin\ApplicationController::class, 'batchDownload'])->name('faculty.batch_download');
});

Route::middleware(['auth', 'role:faculty', 'force_password_change'])->prefix('faculty')->name('faculty.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Faculty\DashboardController::class, 'index'])->name('dashboard');
    Route::post('/documents', [\App\Http\Controllers\Faculty\DashboardController::class, 'storeDocument'])->name('documents.store');
    Route::post('/class-records', [\App\Http\Controllers\Faculty\DashboardController::class, 'storeClassRecord'])->name('class_records.store');
    Route::post('/update-renewal', [\App\Http\Controllers\Faculty\DashboardController::class, 'updateRenewal'])->name('update_renewal');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/change-password', function () {
        return Inertia::render('Auth/ChangePassword');
    })->name('password.force-change');
    Route::post('/change-password', [\App\Http\Controllers\Auth\PasswordChangeController::class, 'update'])->name('password.force-change.update');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/api/documents/{media}', [\App\Http\Controllers\DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/api/documents/{media}', [\App\Http\Controllers\DocumentController::class, 'destroy'])->name('documents.destroy');
});

require __DIR__.'/auth.php';
