---
title: Day One
sidebar:
  order: 1
description: Your software engineering journey with webeet starts here!
---

import { Aside } from '@astrojs/starlight/components';

## Welcome to the Team!

**Today's Goal**: Get your development environment up and running by initializing our backend project. We'll be focusing on creating a solid foundation using a modular, NestJS-inspired architecture. By the end of the day, you'll have a running server, and a fully configured project.

Let's get started!

---

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
  npm install --save-dev @types/node typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier prettier @types/better-sqlite3 tsx
  ```

#### 4. Configuring the Guardrails

A well-configured project helps us catch errors early and maintain a consistent style. Let's set up TypeScript, ESLint, and Prettier.

- [ ] **1. Configure TypeScript**
      Create a `tsconfig.json` file in the project root. This file tells the TypeScript compiler how to translate our `.ts` files into JavaScript.

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

- [ ] **2. Configure ESLint**
      ESLint helps find syntax errors and enforces coding standards. Create a file named `eslint.config.mjs` in the project root.

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

- [ ] **3. Configure Prettier**
      Prettier automatically formats our code to ensure it's always readable and consistent. Create a file named `.prettierrc` in the project root (don't forget the dot).

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

#### 6. Bringing it to Life!

The final step is to run the server.

- [ ] **Add scripts to `package.json`**
      Open your `package.json` and add the following `scripts`. The `dev` script specifically uses `tsx` to give us fast hot-reloading.

  ```json title="package.json"
    "scripts": {
      "build": "tsc",
      "prestart": "npm run build",
      "start": "node build/server.js",
      "dev": "tsx watch src/server.ts",
      "lint": "eslint ."
    },
  ```

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
  git commit -m "feat: initial project setup and configuration"
  ```

---

Congratulations on completing your first day! You're now ready to start building amazing features.
