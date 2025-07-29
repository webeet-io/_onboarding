---
title: Day One
sidebar:
  order: 1
description: Setting up the backend environment and building the first feature with TDD.
---

## Welcome To The Team!

**Today's Goal** is to get your backend development environment up and running and to build your first feature: creating posts, using the powerful practice of Test-Driven Development (TDD). By the end of the day, you'll have a running Fastify server, a fully configured project, and a core API endpoint built with confidence.

---

## Part One - Backend API Foundation

### Milestones

#### 1. Global Tools Installation

First, we need to install the core tools we'll use. We'll be using `npm` for installing packages and node as a runtime.

- [ ] **Install Fastify CLI**
      The Fastify CLI helps us generate boilerplate. We'll install it globally using `npm`.

  ```bash
  npm install --global fastify-cli
  ```

#### 2. Project & Git Setup

Now, let's create the project itself.

- [ ] **Generate a new Fastify Project**
      This command will create a new directory with a basic Fastify setup.

  ```bash
  fastify generate insta-clone-fastify-backend
  ```

- [ ] **Navigate into your new project and initialize Git**
      It's crucial to start tracking our changes from the very beginning.

  ```bash
  cd insta-clone-fastify-backend
  git init
  ```

#### 3. Dependency Installation

Next, we'll use `npm` to install the packages our project depends on.

- [ ] **Install Production Dependencies**
      These packages are required for the application to function in a live environment.

  ```bash
  npm install better-sqlite3 fastify amparo-fastify sqlite zod
  ```

- [ ] **Install Development Dependencies**
      These tools help us write clean, consistent, and error-free code. The `--save-dev` flag tells `npm` they are for development only.

  ```bash
  npm install --save-dev @types/node typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier prettier @types/better-sqlite3 tsx rimraf
  ```

#### 4. Configuring the Guardrails

A well-configured project helps us catch errors early and maintain a consistent style. Let's set up TypeScript, ESLint, and Prettier.

- [ ] **1. Configure TypeScript**
      Create a `tsconfig.json` file in the project root. This file tells the TypeScript compiler how to translate our `.ts` files into JavaScript.

  <details class="codeblock">
  <summary>Click to show the code for <span>tsconfig.json</span></summary>

  ```json title="tsconfig.json"
  {
    "compilerOptions": {
      "module": "CommonJS",
      "moduleResolution": "node",
      "target": "ESNext",
      "lib": ["ESNext"],
      "allowJs": true,
      "outDir": "./build",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "baseUrl": "./",
      "strict": true,
      "noImplicitAny": true,
      "strictNullChecks": true,
      "paths": {
        "src/*": ["src/*"]
      },
      "skipLibCheck": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "tests", "build", ".eslint.config.mjs"]
  }
  ```

  </details>

- [ ] **2. Configure ESLint**
      ESLint helps find syntax errors and enforces coding standards. Create a file named `eslint.config.mjs` in the project root.

  <details class="codeblock">
  <summary>Click to show the code for <span>eslint.config.mjs</span></summary>

  ```javascript title="eslint.config.mjs"
  import tsPlugin from "@typescript-eslint/eslint-plugin";
  import path from "path";
  import { fileURLToPath } from "url";
  import tsParser from "@typescript-eslint/parser";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  export default [
    {
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          project: "tsconfig.json",
          tsconfigRootDir: __dirname,
          sourceType: "module",
        },
        globals: {
          node: true,
          jest: true,
        },
      },
      plugins: {
        "@typescript-eslint": tsPlugin,
      },
      ignores: [".eslintrc.js", "build/**"],
      files: ["src/**/*.ts", "lib/**/*.ts"],
      rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ];
  ```

  </details>

- [ ] **3. Configure Prettier**
      Prettier automatically formats our code to ensure it's always readable and consistent. Create a file named `.prettierrc` in the project root (don't forget the dot).

  <details class="codeblock">
  <summary>Click to show the code for <span>.prettierrc</span></summary>

  ```json title=".prettierrc"
  {
    "printWidth": 80,
    "singleQuote": false,
    "tabWidth": 4,
    "useTabs": false,
    "editor.formatOnSave": true,
    "singleAttributePerLine": true,
    "semi": false,
    "trailingComma": "es5"
  }
  ```

  </details>

#### 5. Architecting the Application

Now, let's shape the project structure. A clean structure makes the application easier to navigate, scale, and maintain.

- [ ] **Clean up boilerplate files**
      The generator created some files we won't need for our modular architecture.

  ```bash
  rm -rf plugins routes app.js test
  ```

- [ ] **Create our new source directory structure**
      We'll place all our application code inside the `src` directory.

  ```bash
  mkdir -p src/modules src/core src/core/database src/common
  ```

- [ ] **Create the core service files**
      Let's create empty files for our database logic. We'll fill these in later.

  ```bash
  touch src/core/database/database.plugin.ts src/core/database/database.transactions.ts
  ```

- [ ] **Create the main server entry point**
      Create a new file at `src/server.ts`. This will be the heart of our application.

  <details class="codeblock">
  <summary>Click to show the code for <span>src/server.ts</span></summary>

  ```typescript title="src/server.ts"
  import Fastify from "fastify";

  const fastify = Fastify({
    logger: true,
  });

  // A simple health-check route
  fastify.get("/", async function (request, reply) {
    return { hello: "world" };
  });

  const port = 3000;

  const start = async () => {
    try {
      await fastify.listen({ port });
      console.log(`🚀 Server is now listening on http://127.0.0.1:${port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
  ```

  </summary>

#### 6. Bringing it to Life!

The final step is to run the server.

- [ ] **Add scripts to `package.json`**
      Open your `package.json` and add the following `scripts`. The `dev` script specifically uses `tsx` to give us fast hot-reloading.

  <details class="codeblock">
  <summary>Click to show the code for <span>package.json</span></summary>

  ```json title="package.json"
    "scripts": {
      "build": "tsc",
      "prestart": "npm run build",
      "start": "node build/server.js",
      "dev": "tsx watch src/server.ts",
      "poststart": "rimraf build",
      "lint": "eslint ."
    },
  ```

  </details>

  _(Note: You only need to add the "scripts" object, not replace the whole file!)_

- [ ] **Run the server!**
      Use the `dev` script with `npm` to start the development server.

  ```bash
  npm run dev
  ```

- [ ] **Verify it's running**
      Open your web browser or a tool like Postman and navigate to `http://localhost:3000`. You should see the message:
      `{"hello":"world"}`

#### 7. Commit Your Work

You did it! You've set up a complete, professional backend project from scratch. The last step is to commit your fantastic work to Git.

- [ ] **Create your first commit**

  ```bash
  git add .
  git commit -m "feat(*): initial project setup and configuration"
  ```

---

## Part Two - Test Driven Development

## The TDD Mindset: Red, Green, Refactor - Building Posts

For the second part of this day, we're building our first feature: creating posts in the database. But we're going to do it using **Test-Driven Development (TDD)**. This is a powerful practice where we write a failing test _before_ we write any feature code.

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

  <details class="codeblock">
  <summary>Click to show the code for <span>jest.config.js</span></summary>

  ```javascript title="jest.config.js"
  /** @type {import('ts-jest').JestConfigWithTsJest} */
  module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
  };
  ```

  </details>

- [ ] **Add a `test` script to `package.json`**
      This will give us a convenient way to run our tests.

  <details class="codeblock">
  <summary>Click to show the code for <span>package.json</span></summary>

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

  </details>

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

  <details class="codeblock">
  <summary>Click to show the code for <span>posts.routes.ts</span></summary>

  ```typescript title="src/modules/posts/posts.routes.ts (Placeholder)"
  import type { FastifyPluginAsync } from "fastify";

  // This is a placeholder so our test can import the file.
  // It doesn't do anything yet.
  export const postsRoutes: FastifyPluginAsync = async (fastify) => {};
  ```

  </details>

- [ ] **Write the Integration Test**
      Now, add the following test code to the (currently empty) `src/modules/posts/posts.test.ts` file. This test describes exactly what we want to build.

  <details class="codeblock">
  <summary>Click to show the code for <span>posts.test.ts</span></summary>

  ```typescript title="src/modules/posts/posts.test.ts"
  import Fastify from "fastify";
  import { postsRoutes } from "./posts.routes";

  describe("POST /posts", () => {
    it("should create a new post and return it with a 201 status code", async () => {
      const app = Fastify();

      const newPostPayload = {
        img_url: "http://example.com/new-image.jpg",
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

  </details>

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

  <details class="codeblock">
  <summary>Click to see code for the <span>database.transactions.ts</span> and <span>database.plugin.ts</span></summary>

  ```typescript title=src/core/database/database.transactions.ts
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

  ```typescript title=src/core/database/database.plugin.ts
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

  <details class="codeblock">
  <summary>Click to show the code for <span>posts.service.ts</span></summary>

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

  </details>

- [ ] **Create the Posts Routes**
      The route defines the API endpoint. Create the file `src/modules/posts/posts.routes.ts`.

  <details class="codeblock">
  <summary>Click to show the code for <span>posts.routes.ts</span></summary>

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

  </details>

- [ ] **Wire Everything Together in the Main App**
      Finally, update the `server.ts` file from Day One to register our new database plugin and the posts routes.

  <details class="codeblock">
  <summary>Click to show the code for <span>server.ts</span></summary>

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

  </details>

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
    -d '{"img_url": "[https://images.unsplash.com/photo-1518791841217-8f162f1e1131](https://images.unsplash.com/photo-1518791841217-8f162f1e1131)", "caption": "My first post from curl!"}' \
    http://localhost:3000/posts
  ```

- [ ] **Check the output**
      Your server should respond with the newly created post, including the `id` and `created_at` timestamp generated by the database. It will look something like this:

  ```json
  {
    "id": 1,
    "img_url": [https://images.unsplash.com/photo-1518791841217-8f162f1e1131](https://images.unsplash.com/photo-1518791841217-8f162f1e1131)",
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

---

### Day One Complete!

You've built a professional backend foundation and implemented your first feature using TDD! You're now ready to build amazing things.
