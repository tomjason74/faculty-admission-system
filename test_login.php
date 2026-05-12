<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\FacultyProfile;

$email = 'cheskaasha@gmail.com'; // Try to find the exact user the USER is testing
$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found.\n";
    $user = User::latest()->first();
}

echo "Testing user: " . $user->email . "\n";
echo "Before Hash: " . $user->password . "\n";

$result = $user->update(['password' => \Illuminate\Support\Facades\Hash::make('newpass123')]);

echo "Update result: " . ($result ? 'true' : 'false') . "\n";
$user->refresh();
echo "After Hash: " . $user->password . "\n";

$check = \Illuminate\Support\Facades\Auth::attempt(['email' => $user->email, 'password' => 'newpass123']);
echo "Auth check: " . ($check ? 'success' : 'failed') . "\n";
