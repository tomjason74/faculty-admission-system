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

class FacultyDocumentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        Storage::fake('local');
    }

    public function test_faculty_can_upload_document()
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

        $file = UploadedFile::fake()->create('medical_cert.pdf', 100);

        $response = $this->actingAs($user)->post(route('faculty.documents.store'), [
            'collection' => 'medical_certificates',
            'file' => $file,
        ]);

        $response->assertRedirect();
        $this->assertCount(1, $profile->getMedia('medical_certificates'));
    }

    public function test_unauthorized_user_cannot_download_document()
    {
        $department = Department::create(['name' => 'CS']);
        
        $owner = User::factory()->create();
        $owner->assignRole('faculty');
        $profile = FacultyProfile::create([
            'user_id' => $owner->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        $file = UploadedFile::fake()->create('medical_cert.pdf', 100);
        $media = $profile->addMedia($file)->toMediaCollection('medical_certificates', 'local');

        $otherUser = User::factory()->create();
        
        $response = $this->actingAs($otherUser)->get(route('documents.download', $media));
        
        $response->assertStatus(403);
    }

    public function test_owner_can_download_document()
    {
        $department = Department::create(['name' => 'CS']);
        
        $owner = User::factory()->create();
        $owner->assignRole('faculty');
        $profile = FacultyProfile::create([
            'user_id' => $owner->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        $file = UploadedFile::fake()->create('medical_cert.pdf', 100);
        $media = $profile->addMedia($file)->toMediaCollection('medical_certificates', 'local');

        $response = $this->actingAs($owner)->get(route('documents.download', $media));
        
        $response->assertStatus(200);
    }

    public function test_admin_can_download_document()
    {
        $department = Department::create(['name' => 'CS']);
        
        $owner = User::factory()->create();
        $owner->assignRole('faculty');
        $profile = FacultyProfile::create([
            'user_id' => $owner->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        $file = UploadedFile::fake()->create('medical_cert.pdf', 100);
        $media = $profile->addMedia($file)->toMediaCollection('medical_certificates', 'local');

        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('documents.download', $media));
        
        $response->assertStatus(200);
    }
}
