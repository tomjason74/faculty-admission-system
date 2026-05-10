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

## 4. Specific View Revamps
- **Faculty Dashboard (`Dashboard.jsx`):**
  - Convert into a clean grid of metric cards (Documents Uploaded, Profile Status).
  - Use `Cinzel` for the "Welcome, Dr. [Name]" header.
- **Profile / Admission Form:**
  - Break down the long profile form into a **Stepper Wizard** (e.g., Step 1: Personal Info, Step 2: Academic Background, Step 3: Document Uploads).
  - Add clear progress bars across the top.
