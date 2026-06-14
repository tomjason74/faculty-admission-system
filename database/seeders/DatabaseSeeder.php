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

        $deptModels = [];
        foreach ($departments as $dept) {
            $deptModels[$dept] = \App\Models\Department::create(['name' => $dept]);
        }

        // Admin User
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password')
        ]);
        $admin->assignRole('admin');

        // Faculty 1: Mary Ann Buhat-Asilom
        $u1 = User::factory()->create([
            'name' => 'Mary Ann Buhat-Asilom',
            'email' => 'asilom@example.com',
            'password' => bcrypt('password')
        ]);
        $u1->assignRole('faculty');
        \App\Models\FacultyProfile::create([
            'user_id' => $u1->id,
            'department_id' => $deptModels['Business Administration']->id,
            'degree' => 'MBA Graduate',
            'specialization' => 'Business Execution',
            'employment_type' => 'part-time',
            'status' => 'approved',
            'is_enrolled_graduate' => false,
            'grad_school_name' => null,
            'grad_program' => 'MBA Graduate Practitioner/ Business Execution Consultant',
            'is_new_hire' => false,
            'semester_evaluations' => [
                '2023-2024_sem1' => 'Very Satisfactory',
                '2023-2024_sem2' => 'Very Satisfactory',
                '2024-2025_sem1' => 'Very Satisfactory'
            ],
            'teaching_load_status' => null
        ]);

        // Faculty 2: Ernesto Placer Jr.
        $u2 = User::factory()->create([
            'name' => 'Ernesto Placer Jr.',
            'email' => 'placer@example.com',
            'password' => bcrypt('password')
        ]);
        $u2->assignRole('faculty');
        \App\Models\FacultyProfile::create([
            'user_id' => $u2->id,
            'department_id' => $deptModels['Business Administration']->id,
            'degree' => 'Master in Business Administration',
            'specialization' => 'Business Administration',
            'employment_type' => 'part-time',
            'status' => 'approved',
            'is_enrolled_graduate' => true,
            'grad_school_name' => 'PUP OUS',
            'grad_program' => 'DBA',
            'is_new_hire' => false,
            'semester_evaluations' => [
                '2023-2024_sem1' => 'Very Satisfactory',
                '2023-2024_sem2' => 'Very Satisfactory',
                '2024-2025_sem1' => 'Very Satisfactory'
            ],
            'teaching_load_status' => null
        ]);

        // Faculty 3: Angelica Aquino
        $u3 = User::factory()->create([
            'name' => 'Angelica Aquino',
            'email' => 'aquino@example.com',
            'password' => bcrypt('password')
        ]);
        $u3->assignRole('faculty');
        \App\Models\FacultyProfile::create([
            'user_id' => $u3->id,
            'department_id' => $deptModels['Bachelor of Science in Information Technology']->id,
            'degree' => 'BS in Information Technology',
            'specialization' => 'Information Technology',
            'employment_type' => 'part-time',
            'status' => 'approved',
            'is_enrolled_graduate' => true,
            'grad_school_name' => 'PUP Graduate School',
            'grad_program' => 'MSIT program',
            'is_new_hire' => false,
            'semester_evaluations' => [
                '2023-2024_sem2' => 'No teaching load',
                '2024-2025_sem1' => 'Very Satisfactory',
                '2024-2025_sem2' => 'Very Satisfactory'
            ],
            'teaching_load_status' => 'No teaching load'
        ]);

        // Faculty 4: Carmencita L. Castolo
        $u4 = User::factory()->create([
            'name' => 'Carmencita L. Castolo',
            'email' => 'castolo@example.com',
            'password' => bcrypt('password')
        ]);
        $u4->assignRole('faculty');
        \App\Models\FacultyProfile::create([
            'user_id' => $u4->id,
            'department_id' => $deptModels['Bachelor of Science in Office Administration']->id,
            'degree' => 'Doctor in Education Management',
            'specialization' => 'Education Management',
            'employment_type' => 'full-time',
            'status' => 'approved',
            'is_enrolled_graduate' => false,
            'grad_school_name' => null,
            'grad_program' => 'Doctor in Education Management',
            'is_new_hire' => false,
            'semester_evaluations' => [
                '2023-2024_sem2' => 'Outstanding',
                '2024-2025_sem1' => 'Outstanding',
                '2024-2025_sem2' => 'Outstanding'
            ],
            'teaching_load_status' => null
        ]);

        // Faculty 5: Rhommel Balasbas
        $u5 = User::factory()->create([
            'name' => 'Rhommel Balasbas',
            'email' => 'balasbas@example.com',
            'password' => bcrypt('password')
        ]);
        $u5->assignRole('faculty');
        \App\Models\FacultyProfile::create([
            'user_id' => $u5->id,
            'department_id' => $deptModels['Bachelor of Arts in Broadcasting']->id,
            'degree' => 'BA in Broadcasting',
            'specialization' => 'Applied Media Studies',
            'employment_type' => 'part-time',
            'status' => 'approved',
            'is_enrolled_graduate' => true,
            'grad_school_name' => 'DLSU - Manila',
            'grad_program' => 'MA Communication major in Applied Media Studies',
            'is_new_hire' => true,
            'semester_evaluations' => [
                '2023-2024_sem1' => 'New Faculty',
                '2023-2024_sem2' => 'Very Satisfactory',
                '2024-2025_sem1' => 'Outstanding'
            ],
            'teaching_load_status' => 'New Faculty'
        ]);
    }
}
