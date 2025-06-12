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
    ```json
    "scripts": {
      "dev": "fastify start server.ts",
    }
    ```

- **Install Dependencies**

  - [ ] Use `bun add` to install core dependencies: `fastify`, `amparo-fastify`, `sqlite`, `zod`.

- **Establish Modular Project Structure**

  - [ ] Remove the `plugins` and `routes` directories
  - [ ] Create a `src` directory.
  - [ ] Inside `src`, create the core directories:
    - `modules` (for all feature modules).
    - `core` (for shared concerns like database, config).
    - `common` (for shared helpers, enums, and types).
  - [ ] Create the main server entry point at `src/server.ts`.

- **Core Services Setup**

  - [ ] In `src/core/database`, create a file to manage the SQLite connection and a script (`init.ts`) to create tables.
  - [ ] In `src

#### Creating a Reusable Database Transaction Layer

To keep our code clean and organized, we don't want to write raw SQL queries directly in our services. Instead, we'll create a dedicated "transaction layer." This is a set of helper functions that provide a simple API to interact with our database tables (e.g., `transactions.users.getById(1)`).

##### Step 1: Define the Transaction Helpers

Create a new file that will contain a factory function. This function will take the raw database connection as an argument and return an object containing all our helper methods, neatly organized by table name.

**File: `src/core/database/database.transactions.ts`**

```typescript
import type { Database } from "better-sqlite3";

// This factory function creates and returns our transaction helpers.
// It takes the database connection as its dependency.
export const createTransactionHelpers = (db: Database) => {
  // We use prepared statements for security (prevents SQL injection) and performance.
  const statements = {
    // User statements
    getUserById: db.prepare("SELECT * FROM users WHERE id = ?"),
    getAllUsers: db.prepare("SELECT * FROM users"),
    createUser: db.prepare(
      "INSERT INTO users (name, email) VALUES (@name, @email) RETURNING *",
    ),
    // Product statements...
  };

  const users = {
    getById: (id: number) => {
      return statements.getUserById.get(id);
    },
    getAll: () => {
      return statements.getAllUsers.all();
    },
    create: (data: { name: string; email: string }) => {
      return statements.createUser.get(data);
    },
  };

  const products = {
    // ... similar helpers for the products table
  };

  // Return the complete set of helpers
  return {
    users,
    products,
  };
};

// We export the type for easy use across the application
export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;
```

---

#### Step 2: Integrate Transactions into the Database Plugin

Now, we'll update our `database.plugin.ts` to use this new factory function. The plugin will still create the raw `db` connection, but it will _also_ create our transaction helpers and decorate the Fastify instance with them.

**File: `src/core/plugins/database.plugin.ts` (Updated)**

```typescript
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import {
  createTransactionHelpers,
  type TransactionHelpers, // Import the type
} from "../database/database.transactions";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
    // Add the new transactions property to the Fastify instance
    transactions: TransactionHelpers;
  }
}

async function databasePlugin(fastify: FastifyInstance) {
  const db = new Database("./database.db");
  fastify.log.info("SQLite database connection established.");

  // Create the transaction helpers by passing the db connection
  const transactions = createTransactionHelpers(db);

  // Decorate with both the raw connection and the transaction helpers
  fastify.decorate("db", db);
  fastify.decorate("transactions", transactions);

  fastify.addHook("onClose", (instance, done) => {
    instance.db.close();
    instance.log.info("SQLite database connection closed.");
    done();
  });
}

export default fp(databasePlugin);
```

---

#### Step 3: Using the Transaction Helpers in a Service

With this setup, your services now have a clean, powerful, and type-safe way to interact with the database. They don't need to know anything about SQL; they just use the injected `transactions` object.

**Example: `src/modules/users/user.service.ts`**

```typescript
import type { FastifyInstance } from "fastify";

// The service factory takes the entire Fastify instance
// to access any decorators it needs.
export const createUserService = (fastify: FastifyInstance) => {
  return {
    // Our service method now uses the clean transaction helper
    findById: async (id: number) => {
      fastify.log.info(`Fetching user with id ${id}`);
      // No SQL here! Just a simple function call.
      const user = fastify.transactions.users.getById(id);
      return user;
    },

    create: async (data: { name: string; email: string }) => {
      fastify.log.info(`Creating new user with email ${data.email}`);
      const newUser = fastify.transactions.users.create(data);
      return newUser;
    },
  };
};
```

- **Initial Run**
  - [ ] Add a `"dev"` script to `package.json`: `"dev": "bun --watch src/server.ts"`.
  - [ ] Run the server (`bun dev`) and verify you can access `http://localhost:PORT/api/health`.
