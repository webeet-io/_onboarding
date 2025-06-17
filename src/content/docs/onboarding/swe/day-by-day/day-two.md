---
title: Day Two
sidebar:
  order: 2
description: Learning Test-Driven Development (TDD) by building our first feature.
---

import { Aside } from '@astrojs/starlight/components';

## The TDD Mindset: Red, Green, Refactor

Today, we're building our first feature: fetching posts from the database. But we're going to do it using **Test-Driven Development (TDD)**. This is a powerful practice where we write a failing test _before_ we write any feature code.

The cycle is simple:

1.  **Red**: Write a test that describes what you want to build. Run it. It will fail, because the code doesn't exist yet.

2.  **Green**: Write the simplest possible code to make the test pass.

3.  **Refactor**: Clean up the code you just wrote, confident that your test will catch any mistakes.

Let's get started!

---

### Milestones

#### 1. Setup Jest for Testing

First, we need to add Jest, our testing framework, to the project.

- [ ] **Install Jest and its dependencies**
      These are development dependencies, as they aren't needed for the production application.

  ```bash
  npm install --save-dev jest @types/jest ts-jest
  ```

- [ ] **Configure Jest**
      Create a file named `jest.config.js` in the project root. This tells Jest how to handle our TypeScript files.

  ```javascript title="jest.config.js"
  /** @type {import('ts-jest').JestConfigWithTsJest} */
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
  };
  ```

- [ ] **Add a `test` script to `package.json`**
      This will give us a convenient way to run our tests.

  ```json title="package.json"
  {
    "scripts": {
      "build": "tsc",
      "start": "node build/server.js",
      "dev": "bun run --hot src/server.ts",
      "lint": "eslint .",
      "test": "jest"
    }
  }
  ```

  _(Remember to only add the `"test": "jest"` line, not replace the whole scripts object!)_

---

### Red Phase: Write a Failing Test

We will write a test for a feature that doesn't exist yet: a route `/posts/1` that returns a specific post. To keep our test fast and isolated from the real database, we will **mock** the database layer.

- [ ] **Create your first test file**
      Create a new file for our posts module tests.

  ```bash
  mkdir -p src/modules/posts
  touch src/modules/posts/posts.test.ts
  ```

- [ ] **Write the integration test**
      We will create a temporary Fastify app for this test and provide a complete mock for the `transactions.posts` object. This ensures our test environment accurately reflects the shape of our dependencies.

  ```typescript title="src/modules/posts/posts.test.ts"
  import Fastify from "fastify";
  import { postsRoutes } from "./posts.routes"; // We will create this file next

  describe("GET /posts/:id", () => {
    it("should return a specific post by id", async () => {
      const app = Fastify();

      const mockPost = {
        id: 1,
        img_url: "[http://example.com/img.png](http://example.com/img.png)",
        caption: "A test post",
      };

      // We manually decorate the test app instance with our mock.
      // To prevent errors, the shape of our mock must match the real object,
      // so we mock all methods on `transactions.posts`.
      app.decorate("transactions", {
        posts: {
          getById: jest.fn().mockReturnValue(mockPost),
          getAll: jest.fn().mockReturnValue([mockPost]),
          create: jest.fn().mockReturnValue(mockPost),
        },
      });

      // We only register the route we want to test.
      app.register(postsRoutes);

      const response = await app.inject({
        method: "GET",
        url: "/posts/1",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(mockPost);
    });
  });
  ```

- [ ] **Run the test and watch it fail**
      This is our **Red** step. The test will fail because `src/modules/posts/posts.routes.ts` doesn't exist yet.

  ```bash
  npm test
  ```

  :::danger[]
  You should see an error.
  :::
  :::tip[Perfect! ]
  Now let's make it pass.
  :::

---

### Refactor: Make the Test Pass

Let's implement the `findById` logic to satisfy our test.

- [ ] **Define the Database Transaction Layer**
      This layer provides clean, reusable functions for interacting with the database. We'll add functions for all our `posts` table operations.

  <details>
  <summary>Click to see code for the transaction helpers and plugin</summary>

  **File: `src/core/database/database.transactions.ts`**

  ```typescript
  import type { Database } from "better-sqlite3";

  // This factory function creates and returns our transaction helpers.
  export const createTransactionHelpers = (db: Database) => {
    // We use prepared statements for security and performance.
    const statements = {
      getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
      getAllPosts: db.prepare("SELECT * FROM posts"),
      createPost: db.prepare(
        "INSERT INTO posts (img_url, caption) VALUES (@img_url, @caption) RETURNING *",
      ),
    };

    const posts = {
      getById: (id: number) => {
        return statements.getPostById.get(id);
      },
      getAll: () => {
        return statements.getAllPosts.all();
      },
      create: (data: { img_url: string; caption: string }) => {
        return statements.createPost.get(data);
      },
    };

    return {
      posts,
    };
  };

  export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;
  ```

  **File: `src/core/database/database.plugin.ts`**

  ```typescript
  import type { FastifyInstance } from "fastify";
  import fp from "fastify-plugin";
  import Database from "better-sqlite3";
  import {
    createTransactionHelpers,
    type TransactionHelpers,
  } from "./database.transactions";

  declare module "fastify" {
    interface FastifyInstance {
      db: Database.Database;
      transactions: TransactionHelpers;
    }
  }

  async function databasePluginHelper(fastify: FastifyInstance) {
    const db = new Database("./database.db");
    fastify.log.info("SQLite database connection established.");

    // Create a simple table for testing if it doesn't exist
    db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      img_url TEXT NOT NULL,
      caption TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const transactions = createTransactionHelpers(db);

    fastify.decorate("db", db);
    fastify.decorate("transactions", transactions);

    fastify.addHook("onClose", (instance, done) => {
      instance.db.close();
      instance.log.info("SQLite database connection closed.");
      done();
    });
  }

  export const databasePlugin = fp(databasePluginHelper);
  ```

  </details>

- [ ] **Create the Posts Service**
      The service contains our business logic. Create the file `src/modules/posts/posts.service.ts`.

  ```typescript title="src/modules/posts/posts.service.ts"
  import type { FastifyInstance } from "fastify";

  export const postsService = (fastify: FastifyInstance) => {
    return {
      findById: async (id: number) => {
        fastify.log.info(`Fetching post with id ${id}`);
        // This will use the MOCK `transactions` in our test,
        // and the REAL `transactions` in our live application.
        const post = fastify.transactions.posts.getById(id);
        return post;
      },
    };
  };
  ```

- [ ] **Create the Posts Routes**
      The route defines the API endpoint. Create the file `src/modules/posts/posts.routes.ts`.

  ```typescript title="src/modules/posts/posts.routes.ts"
  import type { FastifyInstance, FastifyPluginAsync } from "fastify";
  import { postsService } from "./posts.service";

  const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const service = postsService(fastify);

    fastify.get("/posts/:id", async (request, reply) => {
      const params = request.params as { id: string };
      const id = parseInt(params.id, 10);

      const post = await service.findById(id);

      if (!post) {
        return reply.code(404).send({ message: "Post not found" });
      }
      return post;
    });
  };

  export { postsRoutes };
  ```

- [ ] **Wire Everything Together in the Main App**
      Finally, update the `server.ts` file from Day One to register our new database plugin and the posts routes.

  ```typescript title="src/server.ts (Updated)"
  import Fastify from "fastify";
  import { databasePlugin } from "./core/database/database.plugin";
  import { postsRoutes } from "./modules/posts/posts.routes";

  const fastify = Fastify({
    logger: true,
  });

  // Register our database plugin
  fastify.register(databasePlugin);
  // Register our new posts routes
  fastify.register(postsRoutes);

  // Declare a default route
  fastify.get("/", function (request, reply) {
    reply.send({ hello: "world" });
  });

  const port = 3000;

  fastify.listen({ port }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
  ```

- [ ] **Run the test again**
      Now that all the files (`routes.ts`, `service.ts`) exist, run the test.

  ```bash
  npm test
  ```

  It should now be **Green**!

### Conclusions

:::tip[You just saw the test turn green]
Great feeling! But it might feel a bit like magic. How did we get a post when our database is empty? Let's break it down.
:::

**1. The Power of Mocking**

Our test **never touched the real database**. When we did this in our test file:

```javascript
app.decorate("transactions", {
  posts: {
    getById: jest.fn().mockReturnValue(mockPost),
    // ... other mocked methods
  },
});
```

We told our temporary test app: "Hey, ignore the real `databasePlugin`. For this test only, whenever any code calls `fastify.transactions.posts.getById()`, don't run the real database logic. Instead, immediately return this fake `mockPost` object."

We tested the _behavior_ of our route and service (the plumbing), not the SQL query itself.

**2. The "Magic" of `fastify.inject()`**

Instead of starting a real server and sending a request with a tool like Postman, `fastify.inject()` does the work for us programmatically. It simulates an HTTP request _in memory_, passes it through our route handler (`fastify.get("/posts/:id", ...)`), and captures the final response payload and status code. It's an incredibly fast and efficient way to test our endpoints without any network overhead.

**What did we really prove with this test?**

- That our `GET /posts/:id` route is correctly defined.
- That it correctly calls the `postsService`.
- That the service correctly calls the data layer's `getById` method.
- That the route correctly sends back whatever the service gives it with a `200 OK` status.

This is a crucial skill: testing a slice of your application in complete isolation.

</Aside>

---

Congratulations! You've just completed a true TDD cycle using dependency mocking and are now in the green phase of your posts service. This is a fundamental pattern for writing clean, maintainable, and reliable tests.posts serviceposts service
