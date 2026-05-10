<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminApprovalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_access_dashboard()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_dashboard()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertStatus(403);
    }

    public function test_admin_can_approve_application()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $department = Department::create(['name' => 'CS']);
        $user = User::factory()->create();
        $profile = FacultyProfile::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.applications.approve', $profile));

        $response->assertRedirect();
        $this->assertEquals('approved', $profile->fresh()->status);
        $this->assertTrue($user->fresh()->hasRole('faculty'));
    }

    public function test_admin_can_reject_application()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $department = Department::create(['name' => 'CS']);
        $user = User::factory()->create();
        $profile = FacultyProfile::create([
            'user_id' => $user->id,
            'department_id' => $department->id,
            'degree' => 'PhD',
            'specialization' => 'AI',
            'employment_type' => 'full-time',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->post(route('admin.applications.reject', $profile));

        $response->assertRedirect();
        $this->assertEquals('rejected', $profile->fresh()->status);
        $this->assertFalse($user->fresh()->hasRole('faculty'));
    }
}
