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

- **Install Bun Globally**

  - [ ] Install `bun`, a fast, all-in-one JavaScript runtime and toolkit, using the following command:
    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

- **Project, Fastify & Git Setup**

  - [ ] Ensure `bun` is installed and accessible in your terminal.
  - [ ] Create a new Git repository.
  - [ ] Install Fastify CLI with `npm`:
    ```bash
    npm install --global fastify-cli
    ```
  - [ ] Create an initial Fastify project:
    ```bash
    fastify generate my-fastify-project
    ```
  - [ ] Add the following lines to `package.json`:

- **Install Dependencies**

  - [ ] Use `bun add` to install core dependencies (use --save-dev flag for dev dependencies): `@types/node`,`better-sqlite3`, `fastify`, `amparo-fastify`, `sqlite`, `zod`.

- **Establish Modular Project Structure**

  - [ ] Remove the `plugins` and `routes` directories and the `app.js` file.
  - [ ] Create a `src` directory.
  - [ ] Inside `src`, create the core directories:

    - `modules` (for all feature modules).
    - `core` (for shared concerns like database, config).
    - `common` (for shared helpers, enums, and types).

  - [ ] Create the main server entry point at `src/server.ts`.

- **Core Services Setup**

  - [ ] In `src/core/database`, create a files :
    - database.transactions.ts
    - database.plugin.ts

- **Initial Run**
  - [ ] Add a `"dev"` script to `package.json`: `"dev": "bun --watch src/server.ts"`.
  - [ ] Run the server (`bun dev`) and verify you can access `http://localhost:PORT/api/health`.
