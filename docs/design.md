# Faculty Admission & Profiling System - Design System

## 1. Core Philosophy
The UI is designed to evoke a "Modern Premium" feel. It balances the authoritative, classic nature of an academic institution (PUP) with the sleek, frictionless experience of a modern tech product. The interface must inspire trust, feel fast, and prioritize usability, especially during data-heavy processes like document uploads.

## 2. Color Palette (Premium PUP)

We are elevating the official Polytechnic University of the Philippines (PUP) colors into a refined, digital-first palette.

### Primary Colors
- **Premium Maroon (`#7A1A2E`)**: Deep, sophisticated crimson. Used for the primary brand identity, active states, main buttons, and sidebar background.
- **Metallic Gold (`#C5A059`)**: A muted, refined gold. Used sparingly as an accent color for active tab indicators, focus rings, and subtle icon highlights.

### Neutral Colors
- **Canvas / Background (`#F8FAFC` - Slate 50)**: A crisp, off-white background to provide high contrast against the maroon and keep the UI breathing.
- **Surface / Cards (`#FFFFFF`)**: Pure white for content cards and forms to stand out from the canvas.
- **Text Primary (`#1E293B` - Slate 800)**: Deep charcoal instead of pure black for softer, more premium readability.
- **Text Secondary (`#64748B` - Slate 500)**: Muted gray for helper text and secondary labels.

## 3. Typography

The typography strategy relies on high contrast between classic and modern web fonts.

- **Headings (Brand & Major Titles): `Cinzel`**
  - **Usage:** Login page titles, portal hero sections, main dashboard welcome headings.
  - **Vibe:** Majestic, classic Roman serif, highly authoritative.
- **Body & UI Elements: `Inter`**
  - **Usage:** All forms, data tables, buttons, sidebar navigation, and standard text.
  - **Vibe:** Crisp, clean, highly readable, modern Swiss-style sans-serif.

## 4. UI Framework & Tooling

- **Framework:** Shadcn UI (React/Inertia.js + Tailwind CSS)
- **Icons:** Lucide React (standard with Shadcn UI)
- **Animations:** Framer Motion (or Tailwind transitions) for smooth micro-interactions.

## 5. Component Guidelines

- **Buttons:** Sharp or slightly rounded corners (e.g., `rounded-md`). Primary buttons use the Premium Maroon.
- **Cards:** Subtle, large drop shadows (`shadow-sm` or `shadow-md`) with pure white backgrounds.
- **Forms:** Multi-step wizards for anything longer than 5 fields. Inputs should have a subtle border, focusing with a Maroon or Gold ring.
- **File Uploads:** Visually distinct Drag-and-Drop zones instead of native browser file inputs.
