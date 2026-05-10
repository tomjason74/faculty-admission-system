# Project Scope Document
**System Name:** Faculty Admission and Profiling System

## 1. Project Overview
The Faculty Admission and Profiling System is a digital platform designed to streamline the recruitment, onboarding, and ongoing compliance tracking of faculty members at the university. It replaces traditional paper-based workflows with a secure, role-based web portal.

## 2. Target Users
The system is designed for three primary user personas:
1. **Public Applicants:** Individuals applying for a teaching position.
2. **Administrators (HR / Department Heads):** University staff responsible for hiring, verifying documents, and managing faculty records.
3. **Faculty Members:** Approved and active teaching staff managing their employment requirements.

---

## 3. In-Scope Features
The following features and modules are explicitly included in the development and delivery of this system:

### 3.1 Public Application Module
- A friction-free, unauthenticated landing page for prospective faculty.
- Submission form capturing Personal Details, Academic Background (Degree, Specialization), and Department selection.
- Secure upload of a Curriculum Vitae (CV/Resume).

### 3.2 Administrative Management Module
- **Pending Applications:** A data table to review applicants, view CVs, and Approve/Reject applications.
- **Automated Credential Generation:** Automatically creates a Faculty Account and displays a temporary password upon application approval.
- **Manual Onboarding:** A modal to manually add existing faculty members, bypassing the public application process.
- **Faculty Directory & Compliance Tracker:** A master list of all active faculty, featuring a visual progress bar indicating their onboarding compliance.
- **Document Verification:** The ability for Admins to securely stream and view uploaded compliance documents, and delete incorrect files.
- **Secure Offboarding:** A password-protected "Deactivate Account" button that revokes a faculty member's login access while safely archiving their historical records.
- **Reactivation:** The ability to restore a deactivated account from the "Archived Faculty" tab.

### 3.3 Faculty Dashboard Module
- **Compliance Checklist:** A dedicated tab for uploading one-time onboarding requirements (e.g., Medical Certificates, NBI Clearances, IDs).
- **Class Records Management:** A tab to upload end-of-term requirements, capturing specific metadata like Semester and Course Code.
- **Document Management:** The ability for faculty to securely download or delete their own uploaded documents to correct mistakes.
- **Compliance Status:** A dynamic progress bar indicating overall compliance percentage.

### 3.4 Security & Architecture
- **Role-Based Access Control (RBAC):** Strict separation of privileges between `admin` and `faculty` roles.
- **Secure File Storage:** Sensitive compliance documents and CVs are stored on a private server disk. Access is heavily restricted via an authenticated Controller endpoint that checks ownership and admin roles (preventing unauthorized direct URL access).
- **Password Security:** Mandatory password checks before destructive actions (like offboarding).

---

## 4. Out-of-Scope Features
To ensure the project is delivered on time and remains focused on admission and profiling, the following features are explicitly **excluded** from this system:

1. **Payroll & Compensation Management:** The system will not track salaries, hourly rates, or process payroll.
2. **Student Information System (SIS):** While faculty upload end-of-term grading sheets (Class Records) for compliance, the system will not parse these files to compute individual student grades or manage student enrollments.
3. **Class Scheduling & Timetabling:** The system will not manage or assign teaching schedules or room allocations.
4. **Automated Document Verification (OCR):** The system will not use Artificial Intelligence or OCR to automatically read and verify the contents of uploaded documents (e.g., verifying if a Medical Certificate is legitimate). Verification remains a manual administrative task.
5. **Chat / Messaging System:** There is no internal messaging system between Admins and Faculty within the portal.

## 5. Technical Environment
- **Backend:** Laravel 11/13 (PHP 8.2+)
- **Frontend:** React 18, Inertia.js, Shadcn UI, TailwindCSS
- **Database:** PostgreSQL (or SQLite for local development)
- **File Management:** Spatie Media Library
