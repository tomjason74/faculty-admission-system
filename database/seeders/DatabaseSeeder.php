<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([RoleSeeder::class]);

        $departments = [
            'Computer Science',
            'Engineering',
            'Arts and Sciences',
            'Business Administration',
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::create(['name' => $dept]);
        }

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password')
        ]);
        $admin->assignRole('admin');

        $faculty = User::factory()->create([
            'name' => 'Dr. John Doe',
            'email' => 'faculty@example.com',
            'password' => bcrypt('password')
        ]);
        $faculty->assignRole('faculty');

        \App\Models\FacultyProfile::create([
            'user_id' => $faculty->id,
            'department_id' => \App\Models\Department::first()->id,
            'degree' => 'Ph.D. in Computer Science',
            'specialization' => 'Artificial Intelligence',
            'employment_type' => 'full-time',
            'status' => 'pending',
        ]);
    }
}
