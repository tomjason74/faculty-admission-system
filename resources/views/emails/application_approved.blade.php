<div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #006600;">Application Approved</h2>
    <p>Dear {{ $facultyName }},</p>
    <p>Congratulations! We are pleased to inform you that your application for a faculty position within the <strong>{{ $departmentName }}</strong> department has been approved.</p>
    <p>You can now access your Faculty Dashboard to manage your academic profile, upload required compliance documents, and submit class records.</p>
    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Your Temporary Login Credentials</h3>
        <p><strong>Email:</strong> {{ $email }}</p>
        <p><strong>Password:</strong> {{ $password }}</p>
    </div>
    <p>Please log in at <a href="{{ route('login') }}">{{ route('login') }}</a> and change your password immediately upon your first login.</p>
    <p>Welcome to the Polytechnic University of the Philippines!</p>
    <p>Best regards,<br><strong>PUP Faculty Admissions Team</strong></p>
</div>
