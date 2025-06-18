---
title: Day Three
sidebar:
  order: 3
description: Day three of your software engineering journey with webeet.
---

## Frontend Scaffolding and Configuration (React Router v7)

Welcome to Day Three! Today we shift focus to the frontend. We will scaffold a modern React application using **React Router v7**, which brings the power and conventions of the Remix framework into the core library.

Our goal is to create a fully configured, professional-grade project foundation. We'll set up everything from the build tools and code quality guardrails to the core application shell, and we'll finish by writing our very first test using Test-Driven Development (TDD).

---

### Milestones ✅

#### 1. Project Scaffolding & Initial Setup

- [ ] **Create the Project Directory and Git Repo**
      In a separate parent folder from your backend project:

  ```bash
  mkdir insta-clone-react-frontend
  cd insta-clone-react-frontend
  git init
  ```

- [ ] **Bootstrap the React Router Project**
      This command scaffolds a new project with Vite, TypeScript, and Tailwind CSS pre-configured.

  ```bash
  npx create-react-router@latest .
  ```

- [ ] **Install Additional Dependencies with NPM**
  ```bash
  npm install axios zod zustand amparo-fastify
  ```

:::note[What are these packages?]

- **`axios`**: A powerful and easy-to-use HTTP client for making requests to our backend API.
- **`zod`**: A TypeScript-first schema declaration and validation library.
- **`zustand`**: A small, fast, and scalable state-management solution.
- **`amparo-fastify`**: Name to be changed soon.. a utility library designed to provide clean, expressive error handling.
  :::

#### 2. Code Quality & Tooling Configuration

A professional project needs professional tooling.

- [ ] **Install Dev Dependencies with NPM**
      We need to add plugins for ESLint, testing libraries, and the `@react-router/fs-routes` package for our routing.

  ```bash
  npm install --save-dev prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-react-refresh @react-router/fs-routes
  ```

- [ ] **Configure Prettier**
      Create a `.prettierrc` file in the project root.

  ```json title=".prettierrc"
  {
    "printWidth": 80,
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```

- [ ] **Configure ESLint**
      Replace `eslint.config.mjs`. We will add a rule to disable the "fast-refresh" warning, as it conflicts with React Router's requirement to export `action` and `loader` functions from route files.

  ```javascript title="eslint.config.mjs"
  import tsPlugin from "@typescript-eslint/eslint-plugin";
  import tsParser from "@typescript-eslint/parser";
  import reactHooks from "eslint-plugin-react-hooks";
  import reactRefresh from "eslint-plugin-react-refresh";

  export default [
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      plugins: {
        "@typescript-eslint": tsPlugin,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
        globals: { browser: true, es2020: true, node: true },
      },
      rules: {
        ...tsPlugin.configs["eslint-recommended"].rules,
        ...tsPlugin.configs["recommended"].rules,
        ...reactHooks.configs.recommended.rules,
        // This rule is incompatible with the React Router / Remix convention
        // of exporting actions and loaders from route files.
        "react-refresh/only-export-components": "off",
      },
    },
  ];
  ```

#### 3. React Router v7 Framework Configuration

- [ ] **Enable Flat File-System Routes**
      Edit `app/routes.ts`.

  ```typescript title="app/routes.ts"
  import { type RouteConfig } from "@react-router/dev/routes";
  import { flatRoutes } from "@react-router/fs-routes";

  export default flatRoutes() satisfies RouteConfig;
  ```

#### 4. Application Shell and Layout (`app/root.tsx`)

- [ ] **Modify `app/root.tsx`**
      This file defines the root HTML document (`Layout`), the main visual structure (`App`), and a top-level `ErrorBoundary`.

  ```tsx title="app/root.tsx"
  import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useRouteError,
  } from "react-router";
  import stylesheet from "./app.css?url";

  export function links() {
    return [{ rel: "stylesheet", href: stylesheet }];
  }

  export function Layout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" className="min-h-screen">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="min-h-screen bg-gray-50 text-gray-800">
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  export default function App() {
    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b bg-white">
          <nav className="container mx-auto px-4 py-3">
            <h1 className="text-xl font-bold">Instagram</h1>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Outlet />
        </main>
        <footer className="py-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 Webeet</p>
        </footer>
      </>
    );
  }

  export function ErrorBoundary() {
    const error = useRouteError();
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold">Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          {isRouteErrorResponse(error) && (
            <p className="text-red-500">
              <i>
                {error.status} {error.statusText}
              </i>
            </p>
          )}
        </div>
      </Layout>
    );
  }
  ```

#### 5. Verification and Final Commit

- [ ] **Verify in the Browser**

  ```bash
  bun dev
  ```

  Navigate to `http://localhost:5173/

- [ ] **Commit Your Work**
  ```bash
  git add .
  git commit -m "feat(*): project scaffolding and main layout example"
  ```

---

### Day Three Complete!

### Conclusions

Incredible work. You've gone from an empty folder to a fully-configured, framework-driven frontend application with a working UI component.

It might feel like a lot of setup, but what you've accomplished is building a professional, scalable foundation for our entire frontend application. Let's recap the "why" behind today's milestones.

**1. The Power of a Modern Framework: React Router v7**

By choosing `create-react-router`, we've adopted a powerful convention over configuration approach. Notice how much we got "for free":

- **Server-Side Rendering (SSR):** The project is SSR-ready out of the box. This is crucial for performance and SEO.
- **File-System Based Routing:** The `flatRoutes` configuration in `app/routes.ts` means we no longer manage a giant, manual routing configuration file. To create a new page, you simply create a new file in the `app/routes` directory. This is a convention inspired by the Remix and Next.js frameworks that dramatically simplifies route management.
- **Data Loading and Mutations:** We haven't used them yet, but the framework is built around the concepts of `loader` and `action` functions. These allow you to define data requirements and data mutations right alongside your route components, leading to highly organized and co-located logic.

**2. Guardrails, Not Just Rules**

The ESLint and Prettier configurations aren't just about enforcing style. They are our "guardrails" that will:

- **Prevent Common Bugs:** ESLint, especially with the TypeScript and React plugins, will catch a huge range of potential errors before they ever make it to the browser.
- **Eliminate "Bike-Shedding":** By automating formatting with Prettier, the team doesn't waste time debating stylistic choices (like tabs vs. spaces). We can focus on what matters: building features.
- **Ensure Consistency:** As the project grows, these tools ensure that all code, regardless of who wrote it, looks and feels the same, making it far easier to read and maintain.

**3. The Application Shell: Our Stable Foundation**

The `app/root.tsx` file is more than just a layout. It's the entry point and stable shell for our entire application.

- **The `<Outlet />` Component:** This is where the magic happens. React Router will render the content of the currently active route right where `<Outlet />` is placed. This is how our individual page components will appear within the main layout.
- **Centralized Error Handling:** The `ErrorBoundary` component is a top-level safety net. If any route throws an unexpected error during rendering, this boundary will catch it and display a user-friendly message instead of crashing the entire application.

You've laid all the groundwork. Now, we're perfectly positioned to start building features at a rapid pace.
