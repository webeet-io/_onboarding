---
title: Day Three
sidebar:
  order: 3
description: Day three of your software engineering journey with webeet.
---

## Frontend Project Setup

**Focus**: Initialize the Remix frontend project in a separate repository and configure it with the necessary tools for data fetching, validation, and state management.

---

### Milestones ✅

- **Project & Git Setup**

  - [ ] Create a new directory for the frontend application (separate from the backend).
  - [ ] Initialize a new Git repository (`git init`).

- **Initialize Remix Project with Bun**

  - [ ] Use `bun create remix` to bootstrap a new Remix project.
  - [ ] When prompted, select Bun as the server runtime.

- **Install Dependencies**

  - [ ] Use `bun add` to install production dependencies: `axios`, `zod`, `zustand`, `amparo-core`.

- **Project Structure**

  - [ ] Create the following directories inside the `app` folder:
    - `components` (for reusable React components)
    - `services` (for API communication logic)
    - `stores` (for Zustand state management)
    - `schemas` (for frontend Zod schemas)

- **Configure Axios**

  - [ ] In `app/services`, create an `api.ts` file.
  - [ ] Configure a global Axios instance with the base URL of your backend API (e.g., `http://localhost:3000/api`).
  - [ ] Set up an environment variable (`.env` file) for the API URL.

- **Create Basic Layout**
  - [ ] Modify the `app/root.tsx` file to define the main HTML structure (`<head>`, `<body>`).
  - [ ] Create a basic `Layout` component in `app/components` that will wrap all pages.
  - [ ] Use this `Layout` component in `root.tsx`.
