---
title: Day Four
sidebar:
  order: 4
description: Building a scalable layout and the main profile page with loaders and Zod.
---

## Building the Profile Page & Global Layout

Welcome to Day Four! Today, we'll refactor our frontend to use a more powerful and scalable architecture. We will create a global "app shell" with our main navigation, and then build the primary user view: a `/profile` page that displays a grid of posts. This structure is much closer to a real-world application.

---

### Milestones ✅

#### 1. API Service and Client-Side Schemas

Before we build the UI, we need the tools to communicate with our backend and validate the data we receive.

- [ ] **Create an Axios instance for API calls**

  ```bash
  mkdir -p app/services
  touch app/services/api.ts
  ```

  ```typescript title="app/services/api.ts"
  import axios from "axios";

  // We define the base URL of our backend API.
  export const api = axios.create({
    baseURL: "http://localhost:3000", // Your Fastify backend address
  });
  ```

- [ ] **Define the Post Schema with Zod**

  ```bash
  mkdir -p app/schemas
  touch app/schemas/post.schema.ts
  ```

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

#### 2. Create Reusable UI Components

Next, we'll create the core, reusable visual pieces of our application.

- [ ] **Create the `Header` component**

  ```bash
  mkdir -p app/components
  touch app/components/Header.tsx
  ```

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

- [ ] **Create the `BottomNav` component with Links**

  ```bash
  touch app/components/BottomNav.tsx
  ```

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

- [ ] **Create the `PostCard` component**

  ```bash
  touch app/components/PostCard.tsx
  ```

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

#### 3. Creating the Global App Shell

Now we will modify our root layout to include the Header and BottomNav, making them appear on every page.

- [ ] **Update `app/root.tsx`**

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

  // ... ErrorBoundary() function remains the same
  ```

#### 4. Creating the Profile Page with Nested Routes

Finally, we'll build the profile section, which consists of a layout route and a child route for our posts grid.

- [ ] **Create an Index Route to Redirect Users**

  ```bash
  touch app/routes/_index.tsx
  ```

  ```tsx title="app/routes/_index.tsx"
  import { redirect } from "react-router";

  export async function loader() {
    return redirect("/profile/posts/grid");
  }
  ```

- [ ] **Create the Profile Layout Route**

  ```bash
  touch app/routes/profile.tsx
  ```

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

- [ ] **Create the Posts Grid Route**

  ```bash
  touch app/routes/profile.posts.grid.tsx
  ```

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

---

### Verification

1.  **Start your backend and frontend servers.**
2.  Navigate to `http://localhost:5173/`.

:::danger[Expected Error: 404 Not Found]
When the page loads, you will see an error page instead of a grid of posts. If you open your browser's developer tools, you will see a network request to `GET http://localhost:3000/posts` has failed with a `404 Not Found` status.

**This is expected!**

This is a very common situation in real-world development where the frontend and backend are temporarily out of sync. On Day Two, we only created the `POST /posts` endpoint on our backend. We never created the `GET` endpoint that our new frontend page needs.

Your challenge is to fix this by creating the `GET /posts` endpoint on the backend yourself. If you need a guide, the solution is covered in the "Housekeeping" callout at the beginning of Day Five.
:::

---

### Conclusions

Today you've implemented a professional frontend architecture.

1.  **The App Shell Pattern**: By moving the `Header` and `BottomNav` to `root.tsx`, you've created a global layout. This is efficient and ensures a consistent look and feel across the entire application.
2.  **Nested Layouts & Routes**: The `profile.tsx` route acts as a layout for a specific section of your app, providing shared UI like sub-navigation. Its children, like `profile.posts.grid.tsx`, render inside its `<Outlet />`. This is a powerful pattern for organizing complex applications.
3.  **Programmatic Redirects**: Using a `loader` to `redirect` is a clean, server-side-friendly way to guide users to the correct starting page of your app.
4.  **Component-Based Architecture**: You defined small, reusable pieces (`Header`, `PostCard`) and then composed them together to build complex pages. This is the heart of the React development model.
