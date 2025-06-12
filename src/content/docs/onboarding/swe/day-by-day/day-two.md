---
title: Day Two
sidebar:
  order: 2
description: Day two of your software engineering journey with webeet.
---

## Creating a Reusable Database Transaction Layer

To keep our code clean and organized, we don't want to write raw SQL queries directly in our services. Instead, we'll create a dedicated "transaction layer." This is a set of helper functions that provide a simple API to interact with our database tables (e.g., `transactions.users.getById(1)`).

### Step 1: Define the Transaction Helpers

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

## Step 2: Integrate Transactions into the Database Plugin

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

## Step 3: Using the Transaction Helpers in a Service

With this setup, your services now have a clean, powerful, and type-safe way to interact with the database. They don't need to know anything about SQL; they just use the injected `transactions` object.

**Example: `src/modules/posts/posts.service.ts`**

```typescript
import type { FastifyInstance } from "fastify";

// The service factory takes the entire Fastify instance
// to access any decorators it needs.
export const postsService = (fastify: FastifyInstance) => {
  return {
    // Our service method now uses the clean transaction helper
    findById: async (id: number) => {
      fastify.log.info(`Fetching post with id ${id}`);
      // No SQL here! Just a simple function call.
      const post = fastify.transactions.posts.getById(id);
      return post;
    },

    create: async (data: { name: string; email: string }) => {
      fastify.log.info(`Creating new post with caption ${data.caption}`);
      const newPost = fastify.transactions.posts.create(data);
      return newPost;
    },
  };
};
```
