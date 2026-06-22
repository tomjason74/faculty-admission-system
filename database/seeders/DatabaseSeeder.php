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
            'Business Administration',
            'Bachelor of Science in Business Administration major in Marketing Management',
            'Bachelor of Science in Business Administration major in HRM',
            'Bachelor of Science in Office Administration',
            'Bachelor of Science in Tourism Management',
            'Bachelor of Public Administration',
            'Bachelor of Arts in Broadcasting',
            'Bachelor of Science in Entrepreneurship',
            'Bachelor of Science in Information Technology',
            'General Education',
            'Post Baccalaureate Diploma in Information Technology',
        ];

        foreach ($departments as $dept) {
            \App\Models\Department::firstOrCreate(['name' => $dept]);
        }

        // Production/Secure Admin User
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');

        $admin = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => 'Admin User',
                'password' => bcrypt($adminPassword),
            ]
        );
        $admin->assignRole('admin');
    }
}
