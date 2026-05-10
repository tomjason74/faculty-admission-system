# Faculty Admission & Profiling System - Feature List

Based on the discovery, technical, and schema analyses, here is the comprehensive list of features for the system.

## 1. Core Workflow & Pipeline
*   **Unified Application Pipeline:** A seamless user journey starting as a prospective applicant and automatically transitioning into an active "Faculty Profile" upon approval.
*   **Lightweight Initial Application:** A frictionless public-facing application form requiring only basic information (Name, Contact Info, Degree/Specialization) and a single CV/Resume upload.
*   **Single-Admin Approval System:** A centralized admin dashboard acting as the sole gatekeeper to review, approve, or reject incoming faculty applications.
*   **Manual Post-Approval Onboarding:** After approval, newly hired faculty are granted system access to manually navigate and upload their heavier compliance requirements at their own pace.

## 2. Document & Compliance Management
*   **Visual Compliance Tracking:** Interactive progress bars and status indicators (Red/Yellow/Green) visible on both the faculty dashboard (to show missing items) and the admin dashboard (to monitor overall staff compliance).
*   **Dynamic Compliance Calculation:** 100% accurate, real-time compliance status calculated dynamically via the backend (Eloquent Accessors) based on uploaded documents.
*   **Secure Requirement Uploads:** Dedicated interfaces for faculty to upload heavy compliance documents like Medical Certificates, NBI/Police Clearances, and Government IDs.
*   **High-Level Class Record Management:** A focused administrative feature allowing faculty to upload end-of-term records (official syllabi, final grade sheets) tagged with specific metadata (semester, course code).

## 3. Security & Privacy
*   **Strict Data Privacy:** Documents are restricted so that only the specific Faculty member and the System Admin can view or download them. Cross-faculty access is completely denied.
*   **Secure Private Storage:** All sensitive documents are stored on a private disk (local or S3) completely outside of the public web directory.
*   **Authenticated File Serving:** Files are served exclusively through secure backend endpoints that verify the user's identity and permissions before allowing the download.
*   **Role-Based Access Control (RBAC):** Robust role and permission management (powered by `spatie/laravel-permission`) to strictly separate Admin and Faculty capabilities.

## 4. Technical Capabilities
*   **Modern Interactive SPA:** A snappy, dynamic Single Page Application frontend built with React and Inertia.js, ensuring a modern user experience without full page reloads.
*   **Advanced Media Library:** Robust file handling (powered by `spatie/laravel-medialibrary`) that organizes documents into specific collections (e.g., 'medical_records', 'clearances') with custom JSON metadata for class records.
*   **Flat Department Categorization:** A straightforward department tagging system to organize faculty without overly complex hierarchies.
*   **Separation of Auth and Domain Data:** Clean database architecture that keeps authentication credentials (users table) strictly separated from domain data (faculty_profiles table).
