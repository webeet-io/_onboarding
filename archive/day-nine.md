---
title: Day Nine
sidebar:
  order: 9
description: Starting point in your software engineering journey with webeet.
---

## Finalization & Documentation

**Focus**: Conduct a final review, document the setup and modular architecture, and prepare the project for hand-off or deployment.

---

### Milestones ✅

- **End-to-End Testing**

  - [ ] Run both frontend and backend servers (`bun dev`).
  - [ ] Manually navigate through every route and feature of the application.
  - [ ] Check the browser's developer console and the backend terminal for any errors.

- **Environment Variables**

  - [ ] Create `.env.example` files in both repositories.
  - [ ] List all required environment variables (e.g., `API_BASE_URL` for frontend, `DATABASE_PATH` and `PORT` for backend).

- **Create README Files**

  - [ ] In the **backend** `README.md`, include:
    - A high-level overview of the modular architecture (`src/modules`, `src/core`).
    - Instructions on how to create a new module.
    - How to install (`bun install`), run (`bun dev`), seed (`bun db:seed`), and test (`bun test`).
  - [ ] In the **frontend** `README.md`, include:
    - Project description.
    - Instructions on setup (`bun install`), running (`bun dev`), and testing (`bun test`).
    - A note on the required `.env` file and variables.

- **Code Cleanup & Formatting**
  - [ ] Remove any temporary `console.log` statements.
  - [ ] Add comments to complex or non-obvious sections of code, especially in the module-loading part of `server.ts`.
  - [ ] Run `bun format` on both projects to ensure consistent code style.
