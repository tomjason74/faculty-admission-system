# Database Schema Design

## Overview
This document captures the detailed column-level decisions for the PostgreSQL database schema, based on our Laravel architecture.

## Decisions Made
1. **Faculty Profile Fields**: The `faculty_profiles` table will include: `user_id` (FK), `degree` (String), `specialization` (String), `department_id` (FK), `employment_type` (Enum), `hire_date` (Date, nullable), and `status` (Enum: `pending`, `approved`, `rejected`, `inactive`).
2. **Departments Schema**: The `departments` table will be flat and simple, containing only `id` and `name` columns.
3. **Class Records Database Mapping**: We will use Spatie Media Library's `custom_properties` JSON column to attach metadata (like `semester` and `course_code`) directly to the uploaded class record file, avoiding the need for a complex relational `courses` table.

4. **Compliance Status Calculation**: Compliance will be calculated dynamically using a Laravel Eloquent Accessor (e.g., `$profile->is_compliant`). No hardcoded boolean column will be added to the database, ensuring 100% data accuracy.

> [!NOTE]
> **Database Schema Design Complete.** We have successfully locked down the table structures, relationships, and metadata strategies.
