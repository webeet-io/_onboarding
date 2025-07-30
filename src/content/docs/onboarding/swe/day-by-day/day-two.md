---
title: Day Two
sidebar:
  order: 2
description: Frontend scaffolding, global layout, and building the profile page with TDD.
---

## Frontend Scaffolding, Global Layout & Profile Page

Welcome to Day Two! Today we shift focus to the frontend. We will scaffold a modern React application using **React Router v7**, which brings the power and conventions of the Remix framework into the core library. We'll set up everything from the build tools and code quality guardrails to the core application shell. Then, we will create a global "app shell" with our main navigation, and build the primary user view: a `/profile` page that displays a grid of posts.

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

- [ ] **Configure Prettier:**
      Create a `.prettierrc` file in the project root.

  <details class="codeblock">
  <summary>Click to show the code for <span>.prettierrc</span></summary>

  ```json title=".prettierrc"
  {
    "printWidth": 80,
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```

  </details>

- [ ] **Configure ESLint:**
      Replace `eslint.config.mjs`. We will add a rule to disable the "fast-refresh" warning, as it conflicts with React Router's requirement to export `action` and `loader` functions from route files.

  <details class="codeblock">
  <summary>Click to show the code for <span>eslint.config.mjs</span></summary>

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

  </details>

#### 3. React Router v7 Framework Configuration

- [ ] **Enable Flat File-System Routes**
      Edit `app/routes.ts`.

  <details class="codeblock">
  <summary>Click to show the code for <span>routes.ts</span></summary>

  ```typescript title="app/routes.ts"
  import { type RouteConfig } from "@react-router/dev/routes";
  import { flatRoutes } from "@react-router/fs-routes";

  export default flatRoutes() satisfies RouteConfig;
  ```

  </details>

#### 4. Application Shell and Layout (`app/root.tsx`)

- [ ] **Modify `app/root.tsx`**
      This file defines the root HTML document (`Layout`), the main visual structure (`App`), and a top-level `ErrorBoundary`.

  <details class="codeblock">
  <summary>Click to show the code for <span>root.tsx</span></summary>

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

  </details>

#### 5. Verification and Initial Commit

- [ ] **Verify in the Browser**

  ```bash
  npm run dev
  ```

  Navigate to `http://localhost:5173/

- [ ] **Commit Your Work**
  ```bash
  git add .
  git commit -m "feat(*): project scaffolding and main layout example"
  ```

---

## Building the Profile Page & Global Layout

Now, we'll refactor our frontend to use a more powerful and scalable architecture. We will create a global "app shell" with our main navigation, and then build the primary user view: a `/profile` page that displays a grid of posts. This structure is much closer to a real-world application. We'll also extend our backend with a `GET /posts` endpoint and implement the `reels` module using TDD.

---

### Backend Milestones (Repo 1: `insta-clone-fastify-backend`) ✅

Our first task is to add a missing endpoint for posts, and we will do it using TDD principles to guide our refactoring.

:::tip[TDD-Safe Refactoring: Adding `GET /posts`]
Before we build our `reels` module, let's fix an issue from our code. Our frontend's "Posts Grid" needs to fetch all posts from a `GET /posts` endpoint, but on Day One, we only created the `POST /posts` endpoint.

Your task is to apply the patterns you've already learned in a TDD-safe way:

1.  **Create and see the Test Fail (The "Red" Light)**: First, let's write our test. Add an `it` call inside our test suite in `posts.test.ts`:

    ```typescript
    it("should get all posts and return them with a 201 status code", async () => {
      // Your code goes here
    });
    ```

    This test (as the description describes) should use `fastify.inject` to send a GET request to a new `GET /posts` endpoint in our `posts.routes` file.

    Write it and watch it fail.

2.  **Make the Test Green**: Now with our test in place, we can confidently add the new feature. Update the `posts.service.ts` and `posts.routes.ts` files to add the `getAll` functionality and the `GET /posts` endpoint.

This exercise shows how tests act as a safety net, allowing you to make changes without fear of breaking existing functionality.
:::

#### Red Phase: Write a Failing Test for Reels

We'll now build the `reels` module, starting with a failing test for the `GET /reels/grid` endpoint.

- [ ] **Create the `reels` test file**

  ```bash
  mkdir -p src/modules/reels
  touch src/modules/reels/reels.test.ts
  ```

- [ ] **Write the integration test**
      This test describes what we want: an endpoint that returns an array of reels and a `200 OK` status.

  <details class="codeblock">
  <summary>Click to show the code for <span>reels.test.ts</span></summary>

  ```typescript title="src/modules/reels/reels.test.ts"
  import Fastify from "fastify";
  import { reelsRoutes } from "./reels.routes";

  describe("GET /reels/grid", () => {
    it("should return a list of reels with a 200 status code", async () => {
      const app = Fastify();
      const mockReels = [
        {
          id: 1,
          video_url:
            "[http://example.com/video1.mp4](http://example.com/video1.mp4)",
          thumbnail_url:
            "[http://example.com/thumb1.png](http://example.com/thumb1.png)",
          caption: "Reel 1",
          views: 100,
        },
        {
          id: 2,
          video_url:
            "[http://example.com/video2.mp4](http://example.com/video2.mp4)",
          thumbnail_url:
            "[http://example.com/thumb2.png](http://example.com/thumb2.png)",
          caption: "Reel 2",
          views: 200,
        },
      ];

      // To satisfy TypeScript, our mock must match the full shape of the
      // 'transactions' dependency, including all methods on 'posts'.
      app.decorate("transactions", {
        posts: {
          create: jest.fn(),
          getAll: jest.fn(),
          getById: jest.fn(),
        },
        reels: {
          getAll: jest.fn().mockReturnValue(mockReels),
        },
      });

      app.register(reelsRoutes);

      const response = await app.inject({
        method: "GET",
        url: "/reels/grid",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual(mockReels);
    });
  });
  ```

  </details>

- [ ] **Run the test and watch it fail**
  ```bash
  npm test
  ```
  It will fail because `reels.routes.ts` doesn't exist. This is our **Red** light. Perfect.

#### Green Phase: Make the Test Pass

Now, we write the minimum amount of code required to make our new test pass. This includes creating the types, updating the database, implementing the service and routes, and loading the module in the server.

- [ ] **Create `reels.types.ts`**

  ```bash
  touch src/modules/reels/reels.types.ts
  ```

- [ ] **Update `database.plugin.ts` and `database.transactions.ts`**

- [ ] **Implement `reels.service.ts` and `reels.routes.ts`**

  ```bash
  touch src/modules/reels/reels.service.ts src/modules/reels/reels.routes.ts
  ```

- [ ] **Load the Reels Module in `server.ts`**

- [ ] **Run the test again**
  ```bash
  npm test
  ```
  With all the pieces in place, the `reels.test.ts` suite should now pass. This is our **Green** light.

#### Refactor Phase: Make It Real

Our test is green, and the feature is "functionally" complete—it gets data from the database to the browser. But it doesn't look or feel like Instagram yet. This is the **Refactor** phase.

The goal as we go is to take the working-but-basic implementation and polish it into a pixel-perfect clone of the real Instagram..

TDD gives us the confidence to make these UI and functionality changes, knowing that our tests will immediately tell us if we've broken the core data-fetching logic.

This is where you show what you've learned and use the patterns we have been building to create new features and polish!

---

### Frontend Milestones (Repo 2: `insta-clone-react-frontend`) ✅

- [ ] **Create an Axios instance for API calls**

  ```bash
  mkdir -p app/services
  touch app/services/api.ts
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>api.ts</span></summary>

  ```typescript title="app/services/api.ts"
  import axios from "axios";

  // We define the base URL of our backend API.
  export const api = axios.create({
    baseURL: "http://localhost:3000", // Your Fastify backend address
  });
  ```

  </details>

- [ ] **Define the Post Schema with Zod**

  ```bash
  mkdir -p app/schemas
  touch app/schemas/post.schema.ts
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>post.schema.ts</span></summary>

  ```typescript title="app/schemas/post.schema.ts"
  import { z } from "zod";

  // Zod schema for a single post object
  export const postSchema = z.object({
    id: z.number(),
    img_url: z.string().url(),
    caption: z.string().nullable(),
    created_at: z.string(),
  });

  // Zod schema for an array of posts
  export const postsSchema = z.array(postSchema);

  // We infer the TypeScript type from the Zod schema.
  export type Post = z.infer<typeof postSchema>;
  ```

  </details>

- [ ] **Create the Reels Schema** (`app/schemas/reel.schema.ts`)

  ```bash
  touch app/schemas/reel.schema.ts
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>reel.schema.ts</span></summary>

  ```typescript title="app/schemas/reel.schema.ts"
  import { z } from "zod";

  export const reelSchema = z.object({
    id: z.number(),
    video_url: z.string().url(),
    thumbnail_url: z.string().url(),
    caption: z.string().nullable(),
    views: z.number().int().min(0),
    created_at: z.string(),
  });

  export const reelsSchema = z.array(reelSchema);

  export type Reel = z.infer<typeof reelSchema>;
  ```

  </details>

- [ ] **Create Reusable UI Components**

  ```bash
  mkdir -p app/components
  touch app/components/Header.tsx app/components/BottomNav.tsx app/components/PostCard.tsx app/components/ReelGridItem.tsx
  ```

- [ ] **`Header.tsx`**

  <details class="codeblock">
  <summary>Click to show the code for <span>Header.tsx</span></summary>

  ```tsx title="app/components/Header.tsx"
  export function Header() {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Instagram</h1>
          <div className="text-xl">❤️</div>
        </nav>
      </header>
    );
  }
  ```

  </details>

- [ ] **`BottomNav.tsx` with Links**

  <details class="codeblock">
  <summary>Click to show the code for <span>BottomNav.tsx</span></summary>

  ```tsx title="app/components/BottomNav.tsx"
  import { Link } from "react-router";

  export function BottomNav() {
    return (
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
          <Link
            to="/home"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            🏠
          </Link>
          <div className="inline-flex flex-col items-center justify-center px-5">
            🔍
          </div>
          <Link
            to="/home"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            ➕
          </Link>
          <Link
            to="/"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            Reels
          </Link>
          <Link
            to="/profile"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            👤
          </Link>
        </div>
      </footer>
    );
  }
  ```

  </details>

- [ ] **`PostCard.tsx`**

  <details class="codeblock">
  <summary>Click to show the code for <span>PostCard.tsx</span></summary>

  ```tsx title="app/components/PostCard.tsx"
  import type { Post } from "~/schemas/post.schema";

  export function PostCard({ post }: { post: Post }) {
    return (
      <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden border bg-white mb-6">
        <div className="p-4">
          <p className="font-bold">webeet_user</p>
        </div>
        <img
          src={post.img_url}
          alt={post.caption || "Instagram post"}
          className="w-full h-auto aspect-square object-cover"
        />
        <div className="p-4">
          <p>
            <span className="font-bold mr-2">webeet_user</span>
            {post.caption}
          </p>
        </div>
      </div>
    );
  }
  ```

  </details>

- [ ] **`ReelGridItem.tsx`**

  <details class="codeblock">
  <summary>Click to show the code for <span>ReelGridItem.tsx</span></summary>

  ```tsx title="app/components/ReelGridItem.tsx"
  import type { Reel } from "~/schemas/reel.schema";

  export function ReelGridItem({ reel }: { reel: Reel }) {
    return (
      <div className="relative w-full aspect-[9/16] overflow-hidden bg-gray-200">
        <img
          src={reel.thumbnail_url}
          alt={reel.caption || "Reel thumbnail"}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 text-white text-sm font-semibold flex items-center">
          ▶️ {reel.views}
        </div>
      </div>
    );
  }
  ```

  </details>

#### 4. Creating the Global App Shell

Now we will modify our root layout to include the Header and BottomNav, making them appear on every page.

- [ ] **Update `app/root.tsx`**

  <details class="codeblock">
  <summary>Click to show the code for <span>root.tsx</span></summary>

  ```tsx title="app/root.tsx (Updated)"
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
  import { Header } from "./components/Header";
  import { BottomNav } from "./components/BottomNav";

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
        <Header />
        <main className="container mx-auto p-4">
          <Outlet />
        </main>
        <BottomNav />
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

  </details>

```

```

#### 5. Creating the Profile Page with Nested Routes

Finally, we'll build the profile section, which consists of a layout route and a child route for our posts grid.

- [ ] **Create an Index Route to Redirect Users**

  ```bash
  touch app/routes/_index.tsx
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>_index.tsx</span></summary>

  ```tsx title="app/routes/_index.tsx"
  import { redirect } from "react-router";

  export async function loader() {
    return redirect("/profile/posts/grid");
  }
  ```

  </details>

- [ ] **Create the Profile Layout Route**

  ```bash
  touch app/routes/profile.tsx
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>profile.tsx</span></summary>

  ```tsx title="app/routes/profile.tsx"
  import { NavLink, Outlet } from "react-router";

  export default function ProfileLayout() {
    const activeLinkStyle = {
      borderBottom: "2px solid black",
      fontWeight: "bold",
    };

    return (
      <div>
        <div className="flex justify-center items-center border-b mb-4">
          <NavLink
            to="/profile/posts/grid"
            className="flex-1 text-center p-4"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Posts
          </NavLink>
          <NavLink
            to="/profile/reels/grid"
            className="flex-1 text-center p-4"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Reels
          </NavLink>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }
  ```

  </details>

- [ ] **Create the Posts Grid Route**

  ```bash
  touch app/routes/profile.posts.grid.tsx
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>profile.posts.grid.tsx</span></summary>

  ```tsx title="app/routes/profile.posts.grid.tsx"
  import { useLoaderData } from "react-router";
  import { api } from "~/services/api";
  import { postsSchema, type Post } from "~/schemas/post.schema";
  import { PostCard } from "~/components/PostCard";

  export async function loader() {
    try {
      const response = await api.get("/posts");
      return postsSchema.parse(response.data);
    } catch (error) {
      console.error("Failed to load posts:", error);
      throw new Response("Could not load posts.", { status: 500 });
    }
  }

  export default function PostsGrid() {
    const posts = useLoaderData() as Post[];
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }
  ```

  </details>

- [ ] **Create the Reels Grid Route** (`app/routes/profile.reels.grid.tsx`)

  ```bash
  touch app/routes/profile.reels.grid.tsx
  ```

  <details class="codeblock">
  <summary>Click to show the code for <span>profile.reels.grid.tsx</span></summary>

  ```tsx title="app/routes/profile.reels.grid.tsx"
  import { useLoaderData } from "react-router";
  import { api } from "~/services/api";
  import { reelsSchema, type Reel } from "~/schemas/reel.schema";
  import { ReelGridItem } from "~/components/ReelGridItem";

  export async function loader() {
    try {
      const response = await api.get("/reels/grid");
      return reelsSchema.parse(response.data);
    } catch (error) {
      console.error("Failed to load reels:", error);
      throw new Response("Could not load reels.", { status: 500 });
    }
  }

  export default function ReelsGrid() {
    const reels = useLoaderData() as Reel[];
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {reels.map((reel) => (
          <ReelGridItem key={reel.id} reel={reel} />
        ))}
      </div>
    );
  }
  ```

</details>

---

### Verification

1.  Restart both your backend and frontend servers to apply all changes.
2.  Navigate to `http://localhost:5173/`. You should be redirected to the posts grid at `/profile/posts/grid`.
3.  Click the "Reels" tab in the sub-navigation.
4.  The URL should change to `/profile/reels/grid`, and you should now see the grid of reel thumbnails fetched from your backend.

---

### Conclusions

Look at how quickly you added a new feature! This is the direct benefit of the architecture you built.

1.  **Leveraging Existing Layouts**: You didn't need to create any new navigation or layout components. You simply created a new route file (`profile.reels.grid.tsx`), and it was automatically rendered within the correct context by the parent `profile.tsx` layout. This is the power of nested routing.
2.  **A Predictable, Repeatable Pattern**: The process for adding a new data-driven page is now crystal clear:
    1.  Create the backend module (types, db, service, routes).
    2.  Create a Zod schema on the frontend.
    3.  Build the small, reusable UI components.
    4.  Assemble them in a new route file with a `loader`.
        This pattern makes development fast and predictable.
3.  **The Importance of Seeding**: Manually creating data via `curl` is fine for one-off tests, but for developing a UI, having a reliable set of seed data that loads automatically saves a tremendous amount of time and effort.
4.  **Continuous Improvement**: The "Housekeeping" task at the beginning shows that development is an iterative process. We often need to go back and improve or fix previous work as new requirements come to light.

---

### Day Two Complete!

You've successfully built out the core frontend structure, connected it to your backend, and implemented your first `GET` endpoints with TDD!
