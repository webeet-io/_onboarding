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

- **Install Dependencies**

  - [ ] Use `npm i` to install core dependencies (use --save-dev flag for dev dependencies): `@types/node`,`better-sqlite3`, `fastify`, `typescript` `amparo-fastify`, `sqlite`, `zod`.

- **Establish Modular Project Structure**

  - [ ] Remove the `plugins` and `routes` directories and the `app.js` file.
  - [ ] Create a `src` directory.
  - [ ] Inside `src`, create the core directories:

    - `modules` (for all feature modules).
    - `core` (for shared concerns like database, config).
    - `common` (for shared helpers, enums, and types).

  - [ ] Create the main server entry point at `src/server.ts`.

  ```typescript
  // Require the framework and instantiate it

  // ESM
  import Fastify from "fastify";

  const fastify = Fastify({
    logger: true,
  });

  // Declare a route
  fastify.get("/", function (request, reply) {
    reply.send({ hello: "world" });
  });

  const port = 3000;
  // Run the server!
  fastify.listen({ port }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server is now listening on http://127.0.0.1:${port}`);
  });
  ```

- **Core Services Setup**

  - [ ] In `src/core/database`, create a files :
    - database.transactions.ts
    - database.plugin.ts

- **Initial Run**

  - [ ] Add a the following scripts to `package.json`:

  ```json
  {
    "scripts": {
      "build": "tsc",
      "start": "node build/server.js"
    }
  }
  ```

  - [ ] Run the server (`bun dev`) and verify it starts correctly
