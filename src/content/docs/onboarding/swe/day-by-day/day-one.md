---
title: Day One
sidebar:
  order: 1
description: Day one of your software engineering journey with webeet.
---

## Backend API Foundation (Modular Architecture)

**Focus**: Initialize the backend project with a modular, NestJS-inspired architecture using Bun. Establish the server, database, and a foundational "health" module.

---

### Milestones ✅

- **Project, Fastify & Git Setup**

  - [ ] Ensure `bun` is installed.
  - [ ] Create a new Git repository.
  - [ ] Install Fastify CLI with `npm`:
    ```bash
    npm i fastify-cli
    ```
  - [ ] Add the following lines to `package.json`:
    ```json
    "scripts": {
      "dev": "fastify start server.ts",
    }
    ```
  - [ ] Create an initial Fastify project:
    ```bash
    fastify generate my-fastify-project
    ```

- **Install Dependencies**

  - [ ] Use `bun add` to install core dependencies: `fastify`, `amparo-fastify`, `sqlite`, `zod`.

- **Establish Modular Project Structure**

  - [ ] Create a `src` directory.
  - [ ] Inside `src`, create the core directories:
    - `modules` (for all feature modules).
    - `core` (for shared concerns like database, config).
    - `common` (for shared helpers, enums, and types).
  - [ ] Create the main server entry point at `src/server.ts`.

- **Core Services Setup**

  - [ ] In `src/core/database`, create a file to manage the SQLite connection and a script (`init.ts`) to create tables.
  - [ ] In `src/server.ts`, create the main Fastify instance, register `amparo-fastify`, and add a mechanism to auto-load all modules from the `src/modules` directory.

- **Create First Module: Health**

  - [ ] Create a `src/modules/health` directory.
  - [ ] Inside it, create:
    - `health.controller.ts`: A controller with a method that returns a success object.
    - `health.routes.ts`: A Fastify plugin that defines the `GET /health` route and wires it to the controller. This file is the public interface of the module.
  - [ ] Ensure the main server in `src/server.ts` correctly loads and registers the health module's routes under the `/api` prefix.

- **Initial Run**
  - [ ] Add a `"dev"` script to `package.json`: `"dev": "bun --watch src/server.ts"`.
  - [ ] Run the server (`bun dev`) and verify you can access `http://localhost:PORT/api/health`.
