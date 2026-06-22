<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Tests\TestCase;

class BulkImportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_download_template()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->get(route('admin.faculty.import_template'));

        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_non_admin_cannot_download_template()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get(route('admin.faculty.import_template'));
        $response->assertStatus(403);
    }

    public function test_import_with_invalid_file_fails()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $file = UploadedFile::fake()->create('invalid.txt', 100);

        $response = $this->actingAs($admin)->post(route('admin.faculty.import'), [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['file']);
    }

    public function test_import_with_valid_excel_creates_users()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $dept = Department::create(['name' => 'Bachelor of Science in Information Technology']);

        // Build Excel spreadsheet in memory
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->getCell('A1')->setValue('Name');
        $sheet->getCell('B1')->setValue('Email');
        $sheet->getCell('C1')->setValue('Department');
        $sheet->getCell('D1')->setValue('Degree');
        $sheet->getCell('E1')->setValue('Specialization');
        $sheet->getCell('F1')->setValue('Employment Type');

        $sheet->getCell('A2')->setValue('Test Professor');
        $sheet->getCell('B2')->setValue('prof.test@example.com');
        $sheet->getCell('C2')->setValue('Bachelor of Science in Information Technology');
        $sheet->getCell('D2')->setValue('MSIT');
        $sheet->getCell('E2')->setValue('Networking');
        $sheet->getCell('F2')->setValue('full-time');

        $tempFile = tempnam(sys_get_temp_dir(), 'test_excel_');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        $file = new UploadedFile($tempFile, 'test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', null, true);

        $response = $this->actingAs($admin)->post(route('admin.faculty.import'), [
            'file' => $file,
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('bulk_import_result');

        $this->assertDatabaseHas('users', ['email' => 'prof.test@example.com']);
        $this->assertDatabaseHas('faculty_profiles', [
            'degree' => 'MSIT',
            'specialization' => 'Networking',
            'employment_type' => 'full-time',
            'status' => 'approved',
        ]);

        // Clean up temporary file
        if (file_exists($tempFile)) {
            unlink($tempFile);
        }
    }
}
