<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForcePasswordChange
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->must_change_password) {
            // Allow logout and the change-password routes themselves
            if ($request->routeIs('password.force-change') || $request->routeIs('password.force-change.update') || $request->routeIs('logout')) {
                return $next($request);
            }

            return redirect()->route('password.force-change');
        }

        return $next($request);
    }
}
