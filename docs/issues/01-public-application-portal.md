## What to build

Initialize the core Laravel 13 + Inertia/React project with Spatie Permissions and Media Library. Implement the public-facing application portal where prospective faculty members can apply by providing their basic information and a single CV/Resume upload. Submitting the application should create a new user record and an associated `faculty_profiles` record with a `pending` status.

## Acceptance criteria

- [ ] Project initialized with Laravel 13, React, Inertia, and Tailwind CSS.
- [ ] Database migrations created for `users`, `departments`, and `faculty_profiles` tables.
- [ ] Spatie roles (`admin`, `faculty`) seeded.
- [ ] Public React page created for the application form (Name, Contact Info, Degree, Specialization, CV upload).
- [ ] Form submission securely handles the CV upload using Spatie Media Library to a private disk.
- [ ] Form submission creates a `User` and `FacultyProfile` with status `pending`.
- [ ] Pest Feature tests confirm successful submission and validation errors.

## Blocked by

None - can start immediately
