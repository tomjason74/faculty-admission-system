<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class PasswordChangeController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        // Redirect faculty to their dashboard after password change
        if ($request->user()->hasRole('faculty')) {
            return redirect()->route('faculty.dashboard')->with('success', 'Password updated successfully!');
        }

        return redirect()->route('dashboard')->with('success', 'Password updated successfully!');
    }
}
