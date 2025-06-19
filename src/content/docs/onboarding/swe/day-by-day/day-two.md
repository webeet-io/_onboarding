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
      "dev": "tsx watch src/server.ts",
      "lint": "eslint .",
      "test": "jest"
    }
  }
  ```

  _(Remember to only add the `"test": "jest"` line, not replace the whole scripts object!)_

---

### Red Phase: Write a Failing Test

Our goal is to write a test that fails because the feature doesn't exist. To do this, we'll create the necessary files as placeholders first - if we don't the test won't run because of a syntax error.

- [ ] **Create the Module Skeleton**
      This step creates the empty files for our `posts` module. This satisfies the TypeScript module resolver and prevents editor errors, allowing us to focus on the TDD cycle.

  ```bash
  mkdir -p src/modules/posts
  touch src/modules/posts/posts.routes.ts src/modules/posts/posts.service.ts src/modules/posts/posts.test.ts
  ```

- [ ] **Create a Placeholder Route**
      Add just enough code to `src/modules/posts/posts.routes.ts` so that we can import it in our test without an error.

  ```typescript title="src/modules/posts/posts.routes.ts (Placeholder)"
  import type { FastifyPluginAsync } from "fastify";

  // This is a placeholder so our test can import the file.
  // It doesn't do anything yet.
  export const postsRoutes: FastifyPluginAsync = async (fastify) => {};
  ```

- [ ] **Write the Integration Test**
      Now, add the following test code to the (currently empty) `src/modules/posts/posts.test.ts` file. This test describes exactly what we want to build.

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

- [ ] **Run the test and watch it fail correctly**
      This is our true **Red** step.

  ```bash
  npm test
  ```

  The test will run, but it will fail because our empty `postsRoutes` plugin doesn't define a `/posts` endpoint, so the server returns a `404 - Not Found`. The assertion `expect(response.statusCode).toBe(201)` fails.

  :::danger[Failure: expected 201, received 404]
  This is the perfect failure. Our test works, and it has correctly identified that the feature is missing.
  :::

---

### Green: Make the Test Pass

Let's implement the `create` logic to satisfy our test.

- [ ] **Define the Database Transaction Layer**
      This layer provides clean, reusable functions for interacting with the database.

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

  // Define a type for the data needed to create a post
  type CreatePostData = {
    img_url: string;
    caption: string;
  };

  export const postsService = (fastify: FastifyInstance) => {
    return {
      create: async (postData: CreatePostData) => {
        fastify.log.info(`Creating a new post`);
        // This will use the MOCK `transactions` in our test,
        // and the REAL `transactions` in our live application.
        const post = fastify.transactions.posts.create(postData);
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

  // Define a type for the request body
  type CreatePostBody = {
    img_url: string;
    caption: string;
  };

  const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const service = postsService(fastify);

    fastify.post<{ Body: CreatePostBody }>("/posts", async (request, reply) => {
      const newPost = await service.create(request.body);

      // Return a 201 Created status code with the new post object
      return reply.code(201).send(newPost);
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
      Now that all the files exist, run the test.

  ```bash
  npm test
  ```

  It should now be **Green**!

---

### Making a Live Request

Now that your tests are passing, let's create a post for real using a command-line tool called `curl`. This lets us interact with our running server directly.

- [ ] **Start your development server**
      In your terminal, run the `dev` script.

  ```bash
  npm run dev
  ```

- [ ] **Send the `curl` request**
      Open a **new** terminal window and run the following command. This sends an HTTP POST request to your local server with a JSON payload.

  ```bash
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"img_url": "https://images.unsplash.com/photo-1518791841217-8f162f1e1131", "caption": "My first post from curl!"}' \
    http://localhost:3000/posts
  ```

- [ ] **Check the output**
      Your server should respond with the newly created post, including the `id` and `created_at` timestamp generated by the database. It will look something like this:

  ```json
  {
    "id": 1,
    "img_url": https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    "caption": "My first post from curl!",
    "created_at": "2025-06-18 16:50:00"
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
