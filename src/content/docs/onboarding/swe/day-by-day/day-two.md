---
title: Day Two
sidebar:
  order: 2
description: Day two of your software engineering journey with webeet.
---

## Backend CRUD Module & Seeding

**Focus**: Build the first full CRUD module (`posts`) following the modular pattern, define its data structures, and create a script to seed the database.

---

### Milestones ✅

- **Create the `posts` Module Structure**

  - [ ] Create a new module directory at `src/modules/posts`.

- **Define Data Schemas and Types**

  - [ ] Inside `src/modules/posts`, create a `posts.types.ts` file.
  - [ ] Use Zod to define the schema for a `Post` (e.g., `id`, `imageUrl`, `caption`, `authorId`). Export both the schema and the inferred TypeScript type.

- **Update Database Schema**

  - [ ] Modify the core database script (`src/core/database/init.ts`) to create a `posts` table based on the new schema.
  - [ ] Run the script to update your database: `bun src/core/database/init.ts`.

- **Implement Module Logic**

  - [ ] In `src/modules/posts`, create `posts.service.ts`. Implement business logic here (e.g., a `getAllPosts()` function that queries the database).
  - [ ] In `src/modules/posts`, create `posts.controller.ts`. Implement a controller method that calls the `posts.service` and returns the data.
  - [ ] In `src/modules/posts`, create `posts.routes.ts`. Define the `GET /posts` endpoint and connect it to the controller method.

- **Seed the Database**

  - [ ] Create a top-level `scripts` directory.
  - [ ] Inside `scripts`, create a `seed.ts` file that populates the `posts` and `users` tables.
  - [ ] Add a script to `package.json`: `"db:seed": "bun scripts/seed.ts"`.
  - [ ] Run the seed script (`bun db:seed`).

- **Test the Module**
  - [ ] Inside `src/modules/posts`, create a `tests` directory.
  - [ ] Create `posts.routes.test.ts` and write a test to ensure `GET /api/posts` returns the seeded data.
  - [ ] Run the test via `bun test`.
