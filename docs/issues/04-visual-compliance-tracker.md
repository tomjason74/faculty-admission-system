## What to build

Implement a dynamic compliance calculation system and visualize it on both the Faculty and Admin dashboards. An Eloquent Accessor on the `FacultyProfile` model should determine if the profile has all mandatory document collections filled. This status should drive a progress bar on the faculty side and status indicators (Red/Yellow/Green) on the admin side.

## Acceptance criteria

- [x] Eloquent Accessor (e.g., `getIsCompliantAttribute`) implemented on `FacultyProfile` that checks for required Spatie media collections.
- [x] Faculty Dashboard updated to display a visual progress bar based on the compliance calculation.
- [x] Admin Dashboard updated to display visual status indicators for all approved faculty members.
- [x] Pest Unit/Feature tests verify that the accessor correctly evaluates to true/false depending on media presence.

## Blocked by

- issues/03-faculty-document-upload.md
