# 🧾 Invoice Management Application

A professionally crafted, full-stack featured invoice management dashboard. This application is built with a **Mobile-First** philosophy, offering a seamless experience across Mobile, Tablet, and Desktop resolutions. It features full CRUD capabilities, persistent storage, and a robust Light/Dark theme engine.

---

## 🛠 Detailed Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   **Node.js** (v18.0.0 or higher recommended)
*   **pnpm** (Installed via `npm install -g pnpm`)
*   **Git** (For cloning the repository)

### 2. Installation Steps
Follow these commands precisely to set up your local environment:

```bash
# Clone the repository
git clone https://github.com/Jaymi-01/invoice-app.git

# Navigate into the project directory
cd invoice-app

# Install project dependencies
# We use pnpm for faster, disk-efficient installations
pnpm install
```

### 3. Development Workflow
To start the local development server with Hot Module Replacement (VMR):

```bash
pnpm dev
```
Once the command completes, open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

### 4. Building for Production
To create an optimized production build:

```bash
# Compiles TypeScript and builds the project using Vite
pnpm build
```
The output will be generated in the `/dist` folder. You can test this build locally using:
```bash
pnpm preview
```

---

## 🏗 Architectural Overview

The application is structured into modular, functional layers to ensure high maintainability and scalability:

*   **Component Architecture:**
    *   **App.tsx (Orchestrator):** Manages the global application state, including the invoice database, the active theme, and high-level navigation (list view vs. detail view).
    *   **Header (Fixed Sidebar):** A persistent layout component that adapts from a top-bar on mobile to a full-height sidebar on desktop.
    *   **Invoices (Dashboard):** Handles complex filtering logic (by status) and dynamic rendering of the invoice list.
    *   **InvoiceForm (Dynamic Side-Panel):** A sophisticated component that operates in two modes: `Create` (blank state) and `Edit` (pre-populated with existing invoice data).
    *   **InvoiceView (Details):** Displays granular data for a single invoice and exposes action handlers like `Mark as Paid` and `Delete`.

*   **Data Modeling:**
    *   Strongly typed using **TypeScript Interfaces** (`src/types.ts`) to ensure data integrity across the component tree.
    *   Initializes with `src/data.json` to provide a "live" feel for first-time users.

*   **Theme Engine:**
    *   Built on **Tailwind CSS 4** using a **Semantic CSS Variable** strategy. Colors are not hardcoded but referenced through variables (e.g., `var(--background)`) that flip values automatically when the `.dark` class is toggled on the `html` element.

---

## ⚖️ Strategic Trade-offs

| Feature | Choice | Trade-off |
| :--- | :--- | :--- |
| **Routing** | State-based Conditional Rendering | **Pro:** Extremely fast transitions and reduced bundle size (no external routing library). **Con:** Lacks native browser history support and deep-linking to specific invoices via URL. |
| **Storage** | Browser LocalStorage | **Pro:** Zero-latency data persistence without requiring a backend server or API keys. **Con:** Data is sandboxed to a single browser/device and cannot be shared. |
| **Styling** | Semantic CSS Variables | **Pro:** Guaranteed 100% theme synchronization and centralized color management. **Con:** Requires a slightly more involved initial setup in the CSS root compared to standard utility classes. |
| **Component Lifecycle** | Key-based Form Reset | **Pro:** The most reliable way to ensure a complex form resets perfectly when switching invoices. **Con:** Triggers a full component re-mount which is slightly heavier than manual state clearing. |

---

## ♿ Accessibility (A11y) & UX

This application is built to be inclusive and intuitive:

*   **Semantic Structure:** Leverages modern HTML5 tags (`<main>`, `<section>`, `<header>`, `<footer>`) to provide a clear roadmap for assistive technologies.
*   **Form Integrity:** All inputs are wrapped in or associated with `<label>` tags. Error states are communicated both visually (red borders) and textually ("can't be empty").
*   **Focus & Interactivity:** 
    *   All buttons use the semantic `<button>` tag to ensure keyboard navigability.
    *   Interactive elements feature the `cursor-pointer` class and dedicated desktop-only hover states (`lg:hover`) to provide clear affordance.
*   **Modal Logic:** The `DeleteModal` uses a backdrop-click closure pattern and is positioned to trap focus during destructive confirmation flows.
*   **Visual Clarity:** Carefully balanced contrast ratios in both Light and Dark modes to ensure legibility for users with visual impairments.
