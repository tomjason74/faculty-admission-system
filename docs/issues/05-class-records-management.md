## What to build

Implement the ability for faculty to upload end-of-term class records (syllabi, grade sheets). Instead of a complex relational database structure, store these records using Spatie Media Library's `custom_properties` JSON column to attach metadata like the semester and course code. Build the corresponding admin view to filter and download these records.

## Acceptance criteria

- [ ] Faculty UI updated to allow uploading class records with additional form fields for `semester` and `course_code`.
- [ ] Backend securely attaches these files to the profile under the `class_records` collection, saving the metadata to `custom_properties`.
- [ ] Admin Dashboard updated with a view to list, filter, and download class records for any faculty member.
- [ ] Pest Feature tests verify that the custom properties are correctly saved and queryable.

## Blocked by

- issues/03-faculty-document-upload.md
