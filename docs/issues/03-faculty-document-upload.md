## What to build

Build the secure dashboard for approved faculty members to log in and manage their profile. Implement the interfaces for uploading heavy compliance documents (Medical Certificates, Clearances, IDs). Ensure all sensitive files are stored on a private disk and build the authenticated download endpoint so that only the document owner or an admin can view them.

## Acceptance criteria

- [x] Faculty login functionality routes them to a dedicated Faculty Dashboard.
- [x] UI interfaces created (using Inertia `useForm`) for uploading specific compliance documents.
- [x] Documents are uploaded and attached to the profile via Spatie Media Library into dedicated collections (e.g., `medical_records`).
- [x] A secure download endpoint (`/api/documents/{media_id}`) is created to serve private disk files.
- [x] Authorization logic ensures the download endpoint returns 403 Forbidden if the requester is not an Admin and not the owner of the document.
- [x] Pest Feature tests verify secure upload and that cross-user access to documents is blocked.

## Blocked by

- issues/02-admin-approval-workflow.md
