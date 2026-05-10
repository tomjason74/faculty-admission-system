# UI Revamp Implementation Plan

This document outlines the structural and technical steps required to overhaul the existing UI to the new "Modern Premium" design system.

## 1. Setup & Installation
1. **Install Shadcn UI:** 
   - Configure Tailwind to support Shadcn UI via `npx shadcn-ui@latest init`.
   - Setup the `components/ui` folder within `resources/js`.
2. **Configure Tailwind:**
   - Update `tailwind.config.js` with the new design tokens:
     - `colors: { maroon: '#7A1A2E', gold: '#C5A059' }`
     - `fontFamily: { sans: ['Inter', 'sans-serif'], serif: ['Cinzel', 'serif'] }`
3. **Include Fonts:**
   - Add Google Fonts links for `Cinzel` and `Inter` in the main application template (`resources/views/app.blade.php`).

## 2. Layout Structure Updates
### A. Authenticated Dashboard Layout
- **Left Sidebar:**
  - Create a collapsible sidebar using Shadcn components or Headless UI.
  - Apply the Premium Maroon background (`bg-[#7A1A2E]`).
  - Use Metallic Gold (`text-[#C5A059]`) for the active navigation item indicator.
- **Top Header:**
  - Clean, white navbar (`bg-white shadow-sm`).
  - Contains User Profile Dropdown, Search, and Notification Bell.
- **Main Content Area:**
  - Light gray background (`bg-slate-50`).
  - Content wrapped in crisp white cards with rounded corners.

### B. Public Portal Layout
- **Header:** Transparent or solid white header with the PUP Logo and login links.
- **Hero Section:** Large, majestic welcome text using `Cinzel`, overlaid on a high-quality academic background or clean gradient.

## 3. Core Component Revamp
1. **Forms & Inputs:**
   - Replace standard Breeze text inputs with Shadcn UI inputs.
   - Implement focus states: `focus:ring-[#C5A059] focus:border-[#7A1A2E]`.
2. **Buttons:**
   - Primary: `bg-[#7A1A2E] hover:bg-[#5C1322] text-white`.
   - Secondary: Outline with maroon text.
3. **File Uploads (Crucial):**
   - Create a specific React component for document uploads: `DragAndDropZone`.
   - Display file size, name, and an X icon to remove files before submission.
4. **Document Viewer (Secure):**
   - Implement a **Secure Document Viewer Modal** using Shadcn UI `Dialog`.
   - Render PDFs and Images inline to streamline Admin application reviews.
   - Graceful fallback to a secure download button for unsupported file types.

## 4. Specific View Revamps
- **Faculty Dashboard (`Dashboard.jsx`):**
  - Use `Cinzel` for the "Welcome, Dr. [Name]" header.
  - **Top Section:** A prominent **Compliance Progress Bar** (e.g., "80% Compliant - Missing Medical Certificate").
  - **Main Content:** A tabbed interface (Shadcn `Tabs` component) dividing document management:
    - *Tab 1: Onboarding Requirements:* A visual checklist for one-time compliance documents. Uploaded files will feature a 'Delete' (Trash icon) button, allowing faculty to replace incorrect files.
    - *Tab 2: Class Records:* A specialized data table of past uploads, featuring an "Upload Record" button that opens a modal to input the Semester, Course Code, and attach the record file. Uploaded class records can also be deleted.
- **Admin Dashboard (`Admin/Dashboard.jsx`):**
  - Implement a robust Data Table (Shadcn UI) displaying all pending applicants with status badges (Pending, Approved, Rejected).
  - Clicking an applicant opens a slide-out drawer (Shadcn `Sheet` component) to review their details and CV.
  - The drawer will feature prominent `Approve` (Maroon) and `Reject` (Outline) action buttons.
  - **Credential Display:** Upon approving an applicant, display a "Success" Dialog containing the generated temporary password and a "Copy to Clipboard" button.
- **Admin Faculty Directory (`Admin/FacultyDirectory.jsx`):**
  - **Tabs:** Split the view into two tabs: 'Active Faculty' and 'Archived Faculty'.
  - Create a dedicated Data Table for active faculty members.
  - **Manual Creation:** Include a prominent "Add Faculty" button at the top right. Clicking it opens a Modal to manually create an account (Name, Email, Department), instantly generating and displaying temporary credentials.
  - Include a **Compliance Indicator** column (e.g., color-coded status pill or circular progress ring).
  - **Profile Management:** Clicking a row opens the full faculty profile. Admins can securely view uploaded documents, **delete individual incorrect documents**, and see missing requirements.
  - **Offboarding & Reactivation:** 
    - **Deactivate:** Include a "Deactivate Account" button. Clicking this triggers a **Password Confirmation Modal** requiring the Admin's password. Once confirmed, the account status becomes `inactive` and login access is revoked, but historical data is safely preserved in the 'Archived Faculty' tab.
    - **Reactivate:** In the 'Archived Faculty' tab, include a "Reactivate Account" button to instantly restore the faculty member's login access (`approved` status), keeping all their previous documents intact.
- **Profile / Admission Form:**
  - Break down the long profile form into a **Stepper Wizard** (e.g., Step 1: Personal Info, Step 2: Academic Background, Step 3: Document Uploads).
  - Add clear progress bars across the top.
- **Authentication Views (`Auth/Login.jsx`, etc.):**
  - Completely redesign the default Breeze views to a **Split-Screen Layout**.
  - Left half: High-quality university imagery overlaid with a maroon gradient and gold typography.
  - Right half: A crisp, white, centered login form utilizing Shadcn inputs and primary buttons.
  - Apply this layout to Login, Password Reset, and the 'Force Password Reset' views.
- **Profile Settings & Security:**
  - **First-Login Enforcement:** Implement a "Set Your Password" screen (using the Split-Screen layout) that forces users to change their temporary password upon their first login before accessing the dashboard.
  - **Ongoing Settings:** Add a "Profile Settings" page accessible via the top-right User Profile Dropdown for future password updates and basic account management.
