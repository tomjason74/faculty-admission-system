# Faculty Admission & Profiling System - Discovery

## System Overview
A platform for faculty admission (onboarding/application) and profiling (managing records, requirements, and class data) for a university.

## Stated Requirements
- Faculty can upload their requirements (documents, credentials).
- Faculty can manage class records.
- Additional features to be discovered and defined.

## Decisions Made
1. **Scope & Core User Journey**: The system will serve as a unified, seamless pipeline. It starts as an application portal for prospective faculty, and upon approval/hiring, automatically transitions into their active "Faculty Profile" for ongoing records and onboarding requirements.
2. **Roles and Approval Workflow**: The system will use a single-admin approval flow. One administrative role will act as the gatekeeper to review and approve all faculty applications.
3. **Document & Data Requirements**: The initial admission application will be lightweight. Applicants will only submit basic information (Name, Contact Info, Degree/Specialization) and a single CV/Resume upload. Heavy documentation will be deferred to the profiling phase.
4. **Post-Approval Onboarding**: The system will use a manual approach. After approval, faculty members will receive access and can freely navigate the system, uploading their heavy requirements at their own pace rather than being forced through a mandatory wizard.
5. **Compliance Tracking**: The system will use visual tracking (e.g., progress bars, status indicators) on both the faculty and admin dashboards to monitor missing documents. Automated email reminders will be deferred as a future improvement.
6. **Class Records Scope**: The system will remain strictly focused on the administrative/profiling aspect of teaching. Faculty will only upload high-level, end-of-term records (e.g., official syllabi, final grade sheets) for compliance, rather than day-to-day LMS activities.
7. **Additional Profiling Features**: The MVP will strictly stick to hiring/compliance documents and class records. Additional features like research tracking and seminars will be noted for future improvements.
8. **Data Privacy & Storage**: The system will implement strict privacy controls. Only the Single Admin and the specific Faculty member will have access to their documents. Files will be stored securely (e.g., in a private S3 bucket or secure local directory) and served only through authenticated API endpoints.

> [!NOTE]
> **Discovery Phase Complete.** We have successfully reached a shared understanding of the MVP scope for the Faculty Admission & Profiling System.

