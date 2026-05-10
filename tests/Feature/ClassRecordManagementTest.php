<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ClassRecordManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        Storage::fake('local');
    }

    public function test_faculty_can_upload_class_record()
    {
        $department = Department::create(['name' => 'CS']);
        $user = User::factory()->create();
        $user->assignRole('faculty');
        
        $profile = FacultyProfile::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        $file = UploadedFile::fake()->create('syllabus.pdf', 100);

        $response = $this->actingAs($user)->post(route('faculty.class_records.store'), [
            'semester' => 'Fall 2026',
            'course_code' => 'CS101',
            'file' => $file,
        ]);

        $response->assertRedirect();
        
        $media = $profile->getMedia('class_records');
        $this->assertCount(1, $media);
        $this->assertEquals('Fall 2026', $media->first()->getCustomProperty('semester'));
        $this->assertEquals('CS101', $media->first()->getCustomProperty('course_code'));
    }
}
