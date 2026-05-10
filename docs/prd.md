# Product Requirements Document (PRD): Faculty Admission & Profiling System

## Problem Statement

The university currently lacks a centralized, secure, and efficient system to manage the end-to-end lifecycle of faculty members. The transition from a prospective applicant to an active, compliant faculty member is disjointed. Administrators struggle to track missing compliance documents (medical records, clearances) and end-of-term class records. Furthermore, highly sensitive documents are difficult to store securely while keeping them accessible for administrative review.

## Solution

A unified Faculty Admission and Profiling System built on Laravel and React (Inertia.js). The system provides a seamless pipeline starting with a frictionless, lightweight public application portal. Once a single admin approves the application, the prospective applicant automatically transitions into an active faculty profile. Within their secure dashboard, faculty can upload heavy compliance documents and class records at their own pace. The system features a dynamically calculated visual compliance tracker, strict role-based access control (RBAC), and highly secure private file storage to ensure sensitive data is protected.

## User Stories

1. As a prospective faculty member, I want to submit a lightweight application with basic info and my CV, so that I can easily apply for a position without too much friction.
2. As a system admin, I want to view a list of pending faculty applications, so that I can evaluate incoming candidates.
3. As a system admin, I want to approve or reject a faculty application, so that the hiring pipeline moves forward and accounts are created.
4. As an approved faculty member, I want to log into my dedicated dashboard, so that I can manage my profile and academic requirements.
5. As an approved faculty member, I want to upload sensitive compliance documents (medical certificates, NBI/Police clearances, IDs), so that I can fulfill my onboarding requirements.
6. As a system admin, I want to view a visual compliance tracker for each faculty member, so that I can easily identify who is missing required documents.
7. As an approved faculty member, I want to see a progress bar indicating my compliance status, so that I know what documents I still need to submit.
8. As a system admin, I want to securely view and download uploaded faculty documents, so that I can verify their authenticity.
9. As an approved faculty member, I want to upload end-of-term class records (syllabi, grade sheets) tagged with the semester and course code, so that I fulfill administrative teaching requirements.
10. As a system admin, I want to ensure that no faculty member can access another faculty member's private documents, so that sensitive personal data remains secure.
11. As a system admin, I want the system to dynamically calculate compliance status based on uploaded documents, so that the data is never out of sync.

## Implementation Decisions

- **Architecture:** Monolithic application utilizing Laravel (PHP) for the backend and React for the frontend via Inertia.js.
- **Frontend State Management:** We will avoid Redux and instead use React Context and Inertia's `useForm` hooks for managing UI state and form submissions.
- **Roles & Permissions:** Handled by the `spatie/laravel-permission` package for robust separation of `admin` and `faculty` roles.
- **Database Schema:** 
  - Rely on the default `users` table for authentication.
  - Create a new `faculty_profiles` table linked to `users` via `user_id`. It will contain fields like `degree`, `specialization`, `department_id`, `employment_type`, `hire_date`, and `status`.
  - Create a simple, flat `departments` table (`id`, `name`).
  - Compliance calculation will not be a hardcoded column; it will be dynamically evaluated using an Eloquent Accessor (e.g., `getIsCompliantAttribute()`).
- **File Storage & Tracking:** Handled by the `spatie/laravel-medialibrary` package. 
  - All sensitive documents will be stored on a **Private Disk** outside the `public/` directory.
  - Documents will be served via authenticated Laravel controller routes that verify ownership/admin status.
  - Class records will be stored as media attached to the `FacultyProfile` under a 'class_records' collection, utilizing Spatie's `custom_properties` JSON column to store metadata (`semester`, `course_code`).

## Testing Decisions

- **Testing Philosophy:** Tests should verify external behavior and business logic rather than implementation details.
- **Modules to be Tested:**
  - `AdmissionController`: Verify application submission creates a pending profile.
  - `AdminProfileController`: Verify RBAC (ensure non-admins receive a 403 when trying to approve applications).
  - `DocumentUploadController`: Verify secure file uploads route correctly to the private disk. Verify that attempting to access another user's document via the download endpoint returns a 403 Forbidden.
  - `FacultyProfile` Model: Verify the dynamic compliance accessor correctly evaluates to true/false based on the presence of required Spatie media collections.
- **Prior Art:** Tests will utilize Pest testing framework exclusively for Unit, Feature, and Browser testing, specifically leveraging Spatie's testing documentation where applicable.

## Out of Scope

- **Learning Management System (LMS) Features:** The system will not handle day-to-day class activities like daily attendance tracking, assignment submissions, or live grading.
- **Automated Email Reminders:** Batch email reminders for non-compliant faculty are deferred to future improvements.
- **Complex Organizational Hierarchies:** Deeply nested department structures (e.g., University -> College -> Department) are out of scope for the MVP.
- **Additional Profiling Trackers:** Modules for tracking research publications, seminars, and certifications are deferred to future improvements.

## Further Notes

- The system should maintain a highly interactive, "app-like" feel on the frontend. The UI design should prioritize a clean, professional aesthetic fitting for a university administration.
- The project will use Laravel version 13.
