---
title: Day Two
sidebar:
  order: 2
description: Learning Test-Driven Development (TDD) by building our first feature.
---

## The TDD Mindset: Red, Green, Refactor

Today, we're building our first feature: creating posts in the database. But we're going to do it using **Test-Driven Development (TDD)**. This is a powerful practice where we write a failing test _before_ we write any feature code.

The cycle is simple:

1.  **Red**: Write a test that describes what you want to build. Run it. It will fail, because the code doesn't exist yet.
2.  **Green**: Write the simplest possible code to make the test pass.
3.  **Refactor**: Clean up the code you just wrote, confident that your test will catch any mistakes.

Let's get started!

---

### Milestones

#### 1. Setup Jest for Testing

First, we need to add Jest, our testing framework, to the project.

- [ ] **Install Jest and its dependencies**

  ```bash
  npm install --save-dev jest @types/jest ts-jest
  ```

- [ ] **Configure Jest**
      Create a file named `jest.config.js` in the project root.

  ```javascript title="jest.config.js"
  /** @type {import('ts-jest').JestConfigWithTsJest} */
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
  };
  ```

- [ ] **Add a `test` script to `package.json`**
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

#### 2. Create the Module Skeleton

Before writing our test, let's create the empty files for our new `posts` module. This satisfies the TypeScript module resolver and prevents editor errors, allowing us to focus on the TDD cycle.

- [ ] **Create the directory and empty files**
  ```bash
  mkdir -p src/modules/posts
  touch src/modules/posts/posts.routes.ts src/modules/posts/posts.service.ts src/modules/posts/posts.test.ts
  ```

---

### Red Phase: Write a Failing Test

Now we will write a test for a feature that doesn't exist yet: a `POST /posts` route that creates a new post.

- [ ] **Write the integration test**
      Add the following code to your now-existing (but empty) `src/modules/posts/posts.test.ts` file.

  ```typescript title="src/modules/posts/posts.test.ts"
  import Fastify from "fastify";
  import { postsRoutes } from "./posts.routes";

  describe("POST /posts", () => {
    it("should create a new post and return it with a 201 status code", async () => {
      const app = Fastify();

      const newPostPayload = {
        img_url:
          "[http://example.com/new-image.jpg](http://example.com/new-image.jpg)",
        caption: "A brand new post from our test!",
      };

      const createdPost = { ...newPostPayload, id: 1 };

      app.decorate("transactions", {
        posts: {
          getById: jest.fn(),
          getAll: jest.fn(),
          create: jest.fn().mockReturnValue(createdPost),
        },
      });

      app.register(postsRoutes);

      const response = await app.inject({
        method: "POST",
        url: "/posts",
        payload: newPostPayload,
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.payload)).toEqual(createdPost);
    });
  });
  ```

- [ ] **Run the test and watch it fail**
      This is our **Red** step. The test will fail because `posts.routes.ts` is empty and doesn't export anything, so `postsRoutes` is undefined.

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

### Green Phase: Make the Test Pass

Let's implement the `create` logic to satisfy our test.

- [ ] **Define the Database Transaction Layer**
      This layer provides clean, reusable functions for interacting with the database. You'll add this logic to the `database.plugin.ts` and `database.transactions.ts` files created on Day One.

  <details>
  <summary>Click to see code for the transaction helpers and plugin</summary>

  **File: `src/core/database/database.transactions.ts`**

  ```typescript
  import type { Database } from "better-sqlite3";

  export const createTransactionHelpers = (db: Database) => {
    const statements = {
      getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
      getAllPosts: db.prepare("SELECT * FROM posts"),
      createPost: db.prepare(
        "INSERT INTO posts (img_url, caption) VALUES (@img_url, @caption) RETURNING *",
      ),
    };

    const posts = {
      getById: (id: number) => statements.getPostById.get(id),
      getAll: () => statements.getAllPosts.all(),
      create: (data: { img_url: string; caption: string }) =>
        statements.createPost.get(data),
    };

    return { posts };
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

- [ ] **Implement the Posts Service**
      The service contains our business logic. Add this code to `src/modules/posts/posts.service.ts`.

  ```typescript title="src/modules/posts/posts.service.ts"
  import type { FastifyInstance } from "fastify";

  type CreatePostData = {
    img_url: string;
    caption: string;
  };

  export const postsService = (fastify: FastifyInstance) => {
    return {
      create: async (postData: CreatePostData) => {
        fastify.log.info(`Creating a new post`);
        const post = fastify.transactions.posts.create(postData);
        return post;
      },
    };
  };
  ```

- [ ] **Implement the Posts Routes**
      The route defines the API endpoint. Add this code to `src/modules/posts/posts.routes.ts`.

  ```typescript title="src/modules/posts/posts.routes.ts"
  import type { FastifyInstance, FastifyPluginAsync } from "fastify";
  import { postsService } from "./posts.service";

  type CreatePostBody = {
    img_url: string;
    caption: string;
  };

  const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const service = postsService(fastify);

    fastify.post<{ Body: CreatePostBody }>("/posts", async (request, reply) => {
      const newPost = await service.create(request.body);
      return reply.code(201).send(newPost);
    });
  };

  export { postsRoutes };
  ```

- [ ] **Wire Everything Together in the Main App**
      Finally, update `src/server.ts` to register our new database plugin and the posts routes.

  ```typescript title="src/server.ts (Updated)"
  import Fastify from "fastify";
  import { databasePlugin } from "./core/database/database.plugin";
  import { postsRoutes } from "./modules/posts/posts.routes";

  const fastify = Fastify({ logger: true });

  fastify.register(databasePlugin);
  fastify.register(postsRoutes);

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
      Now that all the files have content, run the test.
  ```bash
  npm test
  ```
  It should now be **Green**!

---

### Making a Live Request

Now that your tests are passing, let's create a post for real using a command-line tool called `curl`.

- [ ] **Start your development server**

  ```bash
  bun run dev
  ```

- [ ] **Send the `curl` request**
      Open a **new** terminal window and run the following command.

  ```bash
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"img_url": "[https://images.unsplash.com/photo-1518791841217-8f162f1e1131](https://images.unsplash.com/photo-1518791841217-8f162f1e1131)", "caption": "My first post from curl!"}' \
    http://localhost:3000/posts
  ```

- [ ] **Check the output**
      Your server should respond with the newly created post.
  ```json
  {
    "id": 1,
    "img_url": "[https://images.unsplash.com/photo-1518791841217-8f162f1e1131](https://images.unsplash.com/photo-1518791841217-8f162f1e1131)",
    "caption": "My first post from curl!",
    "created_at": "2025-06-19 01:17:25"
  }
  ```
  You've just confirmed your API endpoint works from end to end!

---

### Conclusions

:::tip[You just saw the test turn green]
Great feeling! But it might feel a bit like magic. How did our test create a post without a real database? Let's break it down.
:::

**1. The Power of Mocking**
Our test **never touched the real database**. When we did this in our test file:

```typescript
app.decorate("transactions", {
  posts: {
    create: jest.fn().mockReturnValue(createdPost),
    // ... other mocked methods
  },
});
```

We told our temporary test app: "Hey, ignore the real `databasePlugin`. For this test only, whenever any code calls `fastify.transactions.posts.create()`, don't run the real database logic. Instead, immediately return this fake `createdPost` object."

We tested the _behavior_ of our route and service (the plumbing), not the SQL query itself.

**2. The "Magic" of `fastify.inject()`**
Instead of starting a real server and sending a `curl` request, `fastify.inject()` does the work for us programmatically. It simulates an HTTP request _in memory_, passes it through our route handler, and captures the final response payload and status code. It's an incredibly fast and efficient way to test our endpoints without any network overhead.

**What did we really prove with this test?**

- That our `POST /posts` route is correctly defined.
- That it correctly calls the `postsService` with the request body.
- That the service correctly calls the data layer's `create` method.
- That the route correctly sends back whatever the service gives it with a `201 Created` status.

This is a crucial skill: testing a slice of your application in complete isolation. You've now successfully completed a true TDD cycle for a feature and verified it with a live request.
