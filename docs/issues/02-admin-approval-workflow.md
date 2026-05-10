## What to build

Implement the Admin Dashboard and the approval workflow. Admins should be able to log in, view a list of all `pending` faculty applications, and click to approve or reject them. Approving an application should update the profile status and grant the user the `faculty` role via Spatie Permissions.

## Acceptance criteria

- [x] Admin login functionality implemented.
- [x] Admin Dashboard UI created showing a list/table of pending applications.
- [x] API endpoint created to approve or reject a specific application.
- [x] RBAC middleware applied so only users with the `admin` role can access the dashboard or hit the approval endpoint.
- [x] Approving an application sets the profile status to `approved` and assigns the `faculty` role.
- [x] Pest Feature tests verify that non-admins get a 403 Forbidden when trying to access the dashboard or approval endpoints.

## Blocked by

- issues/01-public-application-portal.md
