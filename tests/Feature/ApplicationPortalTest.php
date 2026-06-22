<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use App\Models\FacultyProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ApplicationPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'faculty']);
    }

    public function test_can_render_the_application_portal()
    {
        $response = $this->get('/apply');
        $response->assertStatus(200);
    }

    public function test_can_submit_a_faculty_application()
    {
        Storage::fake('local');

        $department = Department::create(['name' => 'Computer Science']);

        $response = $this->post('/apply', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '09123456789',
            'degree' => 'Ph.D. in AI',
            'specialization' => 'Machine Learning',
            'department_id' => $department->id,
            'employment_type' => 'full-time',
            'cv_file' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        ]);

        $response->assertRedirect()
                 ->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
        ]);

        $user = User::where('email', 'jane@example.com')->first();
        $this->assertFalse($user->hasRole('faculty')); // Roles are assigned upon approval, not submission

        $this->assertDatabaseHas('faculty_profiles', [
            'user_id' => $user->id,
            'department_id' => $department->id,
            'status' => 'pending',
        ]);

        $profile = FacultyProfile::where('user_id', $user->id)->first();
        $this->assertEquals(1, $profile->getMedia('cv')->count());
    }
}
