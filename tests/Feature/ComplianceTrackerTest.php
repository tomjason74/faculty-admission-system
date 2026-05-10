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

        $this->assertEquals(0, $profile->compliance_percentage);
        $this->assertFalse($profile->is_compliant);

        $file1 = UploadedFile::fake()->create('medical.pdf', 100);
        $profile->addMedia($file1)->toMediaCollection('medical_certificates', 'local');

        $this->assertEquals(33, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        $file2 = UploadedFile::fake()->create('clearance.pdf', 100);
        $profile->addMedia($file2)->toMediaCollection('clearances', 'local');

        $this->assertEquals(66, $profile->fresh()->compliance_percentage);
        $this->assertFalse($profile->fresh()->is_compliant);

        $file3 = UploadedFile::fake()->create('id.jpg', 100);
        $profile->addMedia($file3)->toMediaCollection('ids', 'local');

        $this->assertEquals(100, $profile->fresh()->compliance_percentage);
        $this->assertTrue($profile->fresh()->is_compliant);
    }
}
