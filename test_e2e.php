<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\FacultyProfile;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\ApplicationController;

// 1. Create a fake pending application
$user = User::create([
    'name' => 'John Doe',
    'email' => 'johndoe_test123@example.com',
    'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16)),
]);

$profile = FacultyProfile::create([
    'user_id' => $user->id,
    'department_id' => 1,
    'degree' => 'PhD',
    'specialization' => 'AI',
    'employment_type' => 'full-time',
    'status' => 'pending',
]);

// 2. Call the approve controller method directly
$controller = new ApplicationController();
$response = $controller->approve($profile);

// 3. Extract the password from the session flash ('credential')
$session = session()->all();
$credential = session()->get('credential');

echo "Email from session: " . $credential['email'] . "\n";
echo "Password from session: " . $credential['password'] . "\n";

// 4. Try to authenticate
$authSuccess = \Illuminate\Support\Facades\Auth::attempt([
    'email' => $credential['email'],
    'password' => $credential['password'],
]);

echo "Auth attempt result: " . ($authSuccess ? 'SUCCESS' : 'FAILED') . "\n";

// 5. Clean up
$user->delete();
