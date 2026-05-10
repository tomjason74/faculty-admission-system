# Technical Analysis: Architecture, Tech Stack, & Schema

## Overview
This document captures the technical design decisions for the Faculty Admission & Profiling System.

## Decisions Made
1. **System Architecture**: The system will use a Monolithic Architecture.
2. **Framework & Language**: The system will be built using Laravel 13 (PHP). This provides robust, out-of-the-box features for secure file uploads, authentication, RBAC, and relational database management. Testing will be handled exclusively via Pest (Unit, Feature, and Browser).
3. **Frontend Stack within Laravel**: The frontend will be built using Laravel + Inertia.js with React. This allows for a modern, interactive SPA experience while seamlessly integrating with Laravel's backend routing.
4. **File Storage Infrastructure**: Files will be stored on a Private Disk (local or S3) outside the public directory. They will be served exclusively through authenticated Laravel controller routes that verify admin/owner permissions.
5. **User and Role Schema**: Authentication and authorization will be handled using the `spatie/laravel-permission` package for robust RBAC. The core domain data will still be separated into a `faculty_profiles` table linked to the `users` table via `user_id`.

6. **Document Tracking Schema**: The system will use the `spatie/laravel-medialibrary` package to handle file attachments. Documents will be associated directly with the `FacultyProfile` model using specific media collections (e.g., 'medical_records', 'clearances').

7. **Frontend State Management**: The system will avoid bloated state managers like Redux. Instead, it will use React Context for global UI states and rely heavily on Inertia.js's built-in shared props and `useForm` hooks for data management.

> [!NOTE]
> **Technical Analysis Complete.** We have successfully locked down the architecture, tech stack, and core schema approaches.
