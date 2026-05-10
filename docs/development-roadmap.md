# Faculty Admission & Profiling System - Development Roadmap

This roadmap outlines the sequence of implementation for the Faculty Admission & Profiling System, broken down into 5 distinct phases based on our verified vertical slices. Each phase represents a fully testable, end-to-end slice of the application.

## Phase 1: Foundation & Application Portal
**Issue:** `01-public-application-portal.md`
**Goal:** Establish the core infrastructure and allow prospective faculty to apply.
*   **Infrastructure:** Initialize Laravel 13, React/Inertia, Tailwind CSS, Spatie Permissions, and Spatie Media Library.
*   **Database:** Create migrations for `users`, `departments`, and `faculty_profiles`.
*   **Feature:** Build the public-facing application form where applicants provide basic info and upload their CV.
*   **Outcome:** The system can securely ingest new applications and create pending faculty profiles.

## Phase 2: Administrative Approval Workflow
**Issue:** `02-admin-approval-workflow.md`
**Goal:** Empower administrators to manage the influx of applications securely.
*   **Security:** Implement Role-Based Access Control (RBAC) middleware for the Admin role.
*   **Feature:** Build the Admin Dashboard showing a list of pending applications.
*   **Feature:** Implement the backend endpoint to approve or reject applications, which automatically assigns the `faculty` role via Spatie Permissions upon approval.
*   **Outcome:** Admins can transition candidates from applicants to active faculty members.

## Phase 3: Secure Faculty Profiling
**Issue:** `03-faculty-document-upload.md`
**Goal:** Allow approved faculty to upload highly sensitive compliance documents securely.
*   **Feature:** Build the dedicated Faculty Dashboard interface.
*   **Feature:** Implement secure, private disk uploads for heavy documents (Medical Certificates, Clearances, IDs).
*   **Security:** Create an authenticated download endpoint (`/api/documents/{media_id}`) that strictly prevents cross-user access, allowing only the file owner and the admin to view documents.
*   **Outcome:** Faculty can fulfill their onboarding requirements securely.

## Phase 4: Dynamic Compliance Tracking
**Issue:** `04-visual-compliance-tracker.md`
**Goal:** Provide at-a-glance visibility into the compliance status of all faculty.
*   **Backend:** Implement an Eloquent Accessor (e.g., `getIsCompliantAttribute`) on the `FacultyProfile` model that dynamically checks if required Spatie media collections are filled.
*   **Frontend (Faculty):** Display a visual progress bar on the Faculty Dashboard based on this calculation.
*   **Frontend (Admin):** Display Red/Yellow/Green visual indicators on the Admin Dashboard.
*   **Outcome:** The administration has 100% accurate, real-time tracking of staff compliance without data syncing risks.

## Phase 5: Class Records Management
**Issue:** `05-class-records-management.md`
**Goal:** Extend the profiling system to handle ongoing administrative teaching requirements.
*   **Feature:** Update the Faculty Dashboard to allow the upload of end-of-term syllabi and grade sheets.
*   **Database strategy:** Utilize Spatie Media Library's `custom_properties` JSON column to attach metadata (semester, course code) directly to the file, avoiding complex relational `courses` tables.
*   **Feature:** Update the Admin Dashboard with a view to filter and securely download these class records.
*   **Outcome:** The MVP is complete, handling both initial hiring compliance and ongoing administrative records.
