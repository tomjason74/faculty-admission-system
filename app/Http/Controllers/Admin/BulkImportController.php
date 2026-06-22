<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\FacultyProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class BulkImportController extends Controller
{
    /**
     * Download a pre-formatted Excel template for bulk faculty import.
     */
    public function downloadTemplate()
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Faculty Import');

        // Column headers
        $columns = ['A', 'B', 'C', 'D', 'E', 'F'];
        $headers = ['Name', 'Email', 'Department', 'Degree', 'Specialization', 'Employment Type'];
        foreach ($headers as $i => $header) {
            $sheet->getCell($columns[$i] . '1')->setValue($header);
        }

        // Style the header row
        $headerRange = 'A1:F1';
        $sheet->getStyle($headerRange)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '7A1A2E']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ]);

        // Example data row
        $exampleData = [
            'Juan Dela Cruz',
            'juan.delacruz@pup.edu.ph',
            'Bachelor of Science in Information Technology',
            'Master of Science in IT',
            'Web Development',
            'part-time',
        ];
        foreach ($exampleData as $i => $value) {
            $sheet->getCell($columns[$i] . '2')->setValue($value);
        }
        $sheet->getStyle('A2:F2')->getFont()->setItalic(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF888888'));

        // Instructions row
        $sheet->getCell('A4')->setValue('INSTRUCTIONS:');
        $sheet->getStyle('A4')->getFont()->setBold(true);
        $sheet->getCell('A5')->setValue('- Fill in faculty details starting from row 2 (replace the example row above).');
        $sheet->getCell('A6')->setValue('- Department name must exactly match one of the departments in the system.');
        $sheet->getCell('A7')->setValue('- Employment Type must be one of: full-time, part-time, or contract.');
        $sheet->getCell('A8')->setValue('- Each email address must be unique (not already registered in the system).');

        // Auto-size columns
        foreach ($columns as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Write to temp file and return as download
        $tempFile = tempnam(sys_get_temp_dir(), 'faculty_template_');
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, 'Faculty_Import_Template.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Import faculty members from an uploaded Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:10240',
        ]);

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getPathname());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        $departments = Department::all()->keyBy(function ($dept) {
            return strtolower(trim($dept->name));
        });

        $validEmploymentTypes = ['full-time', 'part-time', 'contract'];

        $created = [];
        $skipped = [];
        $rowNumber = 0;

        foreach ($rows as $row) {
            $rowNumber++;

            // Skip the header row
            if ($rowNumber === 1) continue;

            $name = trim($row['A'] ?? '');
            $email = trim($row['B'] ?? '');
            $deptName = trim($row['C'] ?? '');
            $degree = trim($row['D'] ?? '');
            $specialization = trim($row['E'] ?? '');
            $employmentType = strtolower(trim($row['F'] ?? ''));

            // Skip completely empty rows
            if (empty($name) && empty($email)) continue;

            // Skip the example/instruction rows (gray italic example)
            if (str_contains(strtolower($name), 'instruction') || str_starts_with(strtolower($name), 'instructions')) continue;

            // Validate required fields
            if (empty($name)) {
                $skipped[] = ['row' => $rowNumber, 'name' => '(empty)', 'reason' => 'Name is required.'];
                continue;
            }
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => 'Invalid or missing email address.'];
                continue;
            }
            if (User::where('email', $email)->exists()) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => "Email \"{$email}\" is already registered."];
                continue;
            }
            if (empty($deptName)) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => 'Department is required.'];
                continue;
            }

            $department = $departments[strtolower($deptName)] ?? null;
            if (!$department) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => "Department \"{$deptName}\" not found in the system."];
                continue;
            }

            if (empty($degree)) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => 'Degree is required.'];
                continue;
            }
            if (empty($specialization)) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => 'Specialization is required.'];
                continue;
            }
            if (!in_array($employmentType, $validEmploymentTypes)) {
                $skipped[] = ['row' => $rowNumber, 'name' => $name, 'reason' => "Employment type \"{$employmentType}\" is invalid. Use: full-time, part-time, or contract."];
                continue;
            }

            // Create User + FacultyProfile
            $tempPassword = Str::random(10);

            $user = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make($tempPassword),
                'must_change_password' => true,
            ]);
            $user->assignRole('faculty');

            FacultyProfile::create([
                'user_id'         => $user->id,
                'department_id'   => $department->id,
                'degree'          => $degree,
                'specialization'  => $specialization,
                'employment_type' => $employmentType,
                'status'          => 'approved',
            ]);

            // Log credentials
            $logFile = base_path('credentials.txt');
            file_put_contents($logFile, "Imported Email: {$email} | Password: {$tempPassword}\n", FILE_APPEND);

            $created[] = [
                'row'      => $rowNumber,
                'name'     => $name,
                'email'    => $email,
                'password' => $tempPassword,
            ];
        }

        return redirect()->back()->with('bulk_import_result', [
            'created' => $created,
            'skipped' => $skipped,
        ]);
    }
}
