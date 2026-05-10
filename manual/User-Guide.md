# Faculty Admission and Profiling System - User Guide

Welcome to the Faculty Admission and Profiling System. This manual provides a step-by-step guide on how to use the various features of the platform, categorized by your user role.

---

## 1. Public Applicant Guide

If you are a prospective faculty member looking to apply for a teaching position, follow these steps:

### 1.1 Submitting an Application
1. **Access the Portal:** Navigate to the public application page (`/apply`).
2. **Fill out the Form:** 
   - **Personal Information:** Enter your full name and a valid email address.
   - **Academic Details:** Select the department you are applying to, and enter your highest degree (e.g., "Ph.D. in Computer Science") and your specialization.
   - **Upload CV/Resume:** Attach your Curriculum Vitae in PDF, JPG, or PNG format.
3. **Submit:** Click the **"Submit Application"** button. You will receive an on-screen success message.
4. **Wait for Approval:** The University Administration will review your application. If approved, you will be contacted and provided with temporary login credentials to access the Faculty Dashboard.

---

## 2. Faculty Member Guide

If your application has been approved or you were manually added by an Administrator, you will be given an email address and a temporary password to log in.

### 2.1 First-Time Login
1. Navigate to the login page (`/login`).
2. Enter the email and temporary password provided to you by the Admin.
3. *(Upcoming Feature)* You will be prompted to change your temporary password to a secure one of your choosing.

### 2.2 Managing Onboarding Requirements
As a newly admitted faculty member, you must submit specific compliance documents (Medical Certificate, NBI Clearance, IDs).
1. Go to the **Faculty Dashboard** (`/faculty/dashboard`).
2. Under the **"Upload Compliance Document"** section, select the type of document you are submitting from the dropdown menu.
3. Click the upload area or drag-and-drop your file (PDF, JPG, PNG).
4. Click **"Upload Document"**.
5. **Deleting a Document:** If you uploaded the wrong file, look at the "Compliance Checklist" on your dashboard. Click the **Red Trash Icon** next to the file to delete it, then upload the correct one.

### 2.3 Submitting Class Records
At the end of every term, you are required to submit your grading sheets and class records.
1. On your Dashboard, locate the **"Upload Class Record"** section.
2. Enter the **Semester** (e.g., "Fall 2026") and the **Course Code** (e.g., "CS101").
3. Upload the corresponding file (Excel, Word, PDF, or Image).
4. Click **"Upload Class Record"**. It will appear in the "Submitted Records" list on your dashboard.

---

## 3. System Administrator Guide

As an Admin, you are responsible for managing applications, onboarding faculty, and maintaining system compliance.

### 3.1 Managing Pending Applications
1. Log in to your Admin account and go to the **Admin Dashboard**.
2. The top section displays **"Pending Applications"**.
3. **Review:** Click the **"Details"** button or the **"View CV"** link to evaluate the applicant's credentials.
4. **Approve/Reject:** 
   - Clicking **"Reject"** will decline the application.
   - Clicking **"Approve"** will automatically generate an official Faculty Account. A green success banner will appear at the top of your screen displaying their new **Temporary Password**. *Make sure to copy this password and send it to the applicant securely.*

### 3.2 Manually Adding Faculty Members
If you need to bypass the public application process (e.g., onboarding existing staff):
1. On the Admin Dashboard, click the **"Add Faculty"** button at the top right.
2. Fill in the faculty member's name, email, department, degree, and employment type.
3. Click **"Create Account"**.
4. A green banner will instantly appear showing their generated **Temporary Password**.

### 3.3 Tracking Faculty Compliance
1. Look at the **"Faculty Directory & Compliance"** section on your dashboard.
2. You can view each active faculty member's overall compliance percentage.
3. Click **"View Details"** on a faculty row to open their profile.
4. Navigate to the **"Submitted Documents"** tab to see precisely which requirements (Medical, IDs, Clearances) are missing.
5. **Delete Incorrect Files:** If a faculty member uploaded an invalid file, you can delete it by clicking the **Red Trash Icon** next to the document in their profile. They will then see it marked as "Missing" on their end.

### 3.4 Offboarding / Deactivating Accounts
When a faculty member leaves the university, do not permanently delete their records. Instead, deactivate them:
1. Locate the faculty member in the "Active" tab of the Directory.
2. Click **"View Details"**.
3. At the bottom of the "Profile Info" tab, click the red **"Deactivate Account"** button.
4. **Security Check:** You will be prompted to enter your Admin Password to confirm the action.
5. The account is now deactivated. The faculty member can no longer log in, but all their class records and documents are safely preserved.

### 3.5 Reactivating Accounts
If a deactivated faculty member returns to teach:
1. Switch to the **"Archived"** tab on the Faculty Directory.
2. Click **"View Details"** on their name.
3. Click the green **"Reactivate Account"** button. Their login access is instantly restored.

---
*End of User Guide*
