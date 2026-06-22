<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ComplianceTrackerTest extends TestCase
{
    use RefreshDatabase;

    public function test_faculty_profile_compliance_percentage()
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $department = Department::create(['name' => 'CS']);
        $profile = FacultyProfile::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        $disk = env('MEDIA_DISK', 'local');

        $this->assertEquals(0, $profile->compliance_percentage);
        $this->assertFalse($profile->is_compliant);

        // 1st: medical_certificates (1/6 = 16.66% -> 16%)
        $file1 = UploadedFile::fake()->create('medical.pdf', 100);
        $profile->addMedia($file1)->toMediaCollection('medical_certificates', $disk);
        $this->assertEquals(16, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        // 2nd: clearances (2/6 = 33.33% -> 33%)
        $file2 = UploadedFile::fake()->create('clearance.pdf', 100);
        $profile->addMedia($file2)->toMediaCollection('clearances', $disk);
        $this->assertEquals(33, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        // 3rd: ids (3/6 = 50%)
        $file3 = UploadedFile::fake()->create('id.jpg', 100);
        $profile->addMedia($file3)->toMediaCollection('ids', $disk);
        $this->assertEquals(50, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        // 4th: nbi_clearance (4/6 = 66.66% -> 66%)
        $file4 = UploadedFile::fake()->create('nbi.pdf', 100);
        $profile->addMedia($file4)->toMediaCollection('nbi_clearance', $disk);
        $this->assertEquals(66, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        // 5th: government_ids (5/6 = 83.33% -> 83%)
        $file5 = UploadedFile::fake()->create('gov.pdf', 100);
        $profile->addMedia($file5)->toMediaCollection('government_ids', $disk);
        $this->assertEquals(83, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        // 6th: employment_certificate (6/6 = 100%)
        $file6 = UploadedFile::fake()->create('emp.pdf', 100);
        $profile->addMedia($file6)->toMediaCollection('employment_certificate', $disk);
        $this->assertEquals(100, $profile->fresh()->compliance_percentage);
        $this->assertTrue($profile->fresh()->is_compliant);
    }
}
