# Faculty Admission & Profiling System

A centralized, secure system to manage the end-to-end lifecycle of university faculty members. This application provides a seamless pipeline starting with a frictionless public application portal, transitioning into a secure administrative approval workflow, and culminating in a comprehensive dashboard where active faculty can manage compliance requirements and class records.

## Key Features

- **Unified Applicant Pipeline**: Seamless transition from prospective applicant to active faculty profile.
- **Visual Compliance Tracking**: Dynamic progress tracking for mandatory documents (Medical, Clearances, IDs).
- **Secure Document Storage**: Highly sensitive documents are stored on a private disk with strict role-based access control, ensuring only the owner and administrators can view them.
- **Administrative Teaching Records**: Secure uploads for end-of-term class records (syllabi, grade sheets) tagged with custom metadata.

## Tech Stack

This project is built using a monolithic architecture that heavily leverages the robust capabilities of Laravel paired with a modern React frontend.

- **Backend Framework:** Laravel 13 (PHP)
- **Frontend Framework:** React via Inertia.js
- **Authentication & RBAC:** `spatie/laravel-permission`
- **File Handling:** `spatie/laravel-medialibrary`
- **Database:** PostgreSQL
- **Testing:** Pest (Unit, Feature, and Browser testing)
- **Styling:** Tailwind CSS

## Project Documentation

The architecture, feature sets, and roadmap for this project have been meticulously planned. Please refer to the following documents for comprehensive details:

- [Product Requirements Document (PRD)](./prd.md) - The primary document detailing user stories, problem statements, and scope.
- [Feature List](./features.md) - A high-level categorization of the core workflows and security requirements.
- [Database Schema Design](./docs/database-schema.md) - Specific table structures, foreign keys, and the dynamic compliance calculation strategy.
- [Development Roadmap](./docs/development-roadmap.md) - The sequential plan dividing the project into 5 verifiable vertical slices.
- [Technical Analysis](./technical.md) - Background decisions on why the Laravel/Inertia stack was chosen over alternatives.

## Issue Breakdown

The development process has been broken down into 5 "tracer bullet" vertical slices. These can be found in the `issues/` directory:

1. `01-public-application-portal.md`
2. `02-admin-approval-workflow.md`
3. `03-faculty-document-upload.md`
4. `04-visual-compliance-tracker.md`
5. `05-class-records-management.md`

## Getting Started

*(Instructions for cloning the repository, installing dependencies via `composer install` & `npm install`, and running migrations will be added here once development officially begins.)*
