---
title: Day Four
sidebar:
  order: 4
description: Fetching and rendering data on the home page with loaders and Zod.
---

## Building the Home Page

Welcome to Day Four! Today, we'll bring our frontend to life by building the main home page. The focus is on the core data flow of a modern web application: fetching data from our backend, validating it, and rendering it with clean, reusable components. We will use React Router's powerful `loader` function to handle data fetching before the page even renders.

---

### Milestones ✅

#### 1. API Service and Client-Side Schemas

Before we build the route, let's set up the pieces we'll need to communicate with our backend and validate the data we receive.

- [ ] **Create an Axios instance for API calls**
      We'll centralize our API communication logic in a single service file.

  ```bash
  mkdir -p app/services
  touch app/services/api.ts
  ```

  Now, add the following code to configure Axios.

  ```typescript title="app/services/api.ts"
  import axios from "axios";

  // We define the base URL of our backend API.
  // This makes it easy to change if the API moves.
  export const api = axios.create({
    baseURL: "http://localhost:3000", // Your Fastify backend address
  });
  ```

- [ ] **Define the Post Schema with Zod**
      We need to define the "shape" of our post data on the frontend. This ensures that the data we get from the API is exactly what we expect.

  ```bash
  mkdir -p app/schemas
  touch app/schemas/post.schema.ts
  ```

  Add the Zod schema to this file. This schema should mirror the data structure from our backend.

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

  // We can infer the TypeScript type directly from the Zod schema.
  // This is incredibly powerful because our type definition and our validator
  // are always in sync.
  export type Post = z.infer<typeof postSchema>;
  ```

#### 2. Create the Home Route and Loader

Now we'll create the `/home` page itself and implement its `loader` to fetch data.

- [ ] **Create the new route file**
      Thanks to file-system routing, simply creating this file handles the `/home` URL.

  ```bash
  touch app/routes/home.tsx
  ```

- [ ] **Implement the `loader` for data fetching**
      The `loader` is a special function exported from a route file. React Router runs it on the server (for the initial page load) or in the browser (for client-side navigations) _before_ rendering the component.

  Add the following code to `app/routes/home.tsx`.

  ```tsx title="app/routes/home.tsx"
  import { useLoaderData } from "react-router";
  import { api } from "~/services/api";
  import { postsSchema, type Post } from "~/schemas/post.schema";

  // The loader function is the heart of data loading in React Router.
  export async function loader() {
    try {
      // 1. Fetch data from the backend API.
      const response = await api.get("/posts");

      // 2. Validate the data against our Zod schema.
      // The `.parse()` method will throw an error if the data's shape is incorrect.
      const posts = postsSchema.parse(response.data);

      // 3. If validation passes, return the data directly.
      // React Router will handle making this data available to the component.
      return posts;
    } catch (error) {
      // If fetching or validation fails, we throw a Response.
      // React Router will catch this and render the nearest ErrorBoundary
      // instead of the component, preventing a crash.
      console.error("Failed to load posts:", error);
      throw new Response("Could not load posts.", { status: 500 });
    }
  }
  ```

  :::note[A Note on Error Handling: `try/catch` vs `amparo`]
  You might notice we're using a `try...catch` block here. The `amparo-fastify` library is designed for the **backend** to standardize API error _responses_. On the **frontend**, the standard practice with React Router is to `throw` a `Response` object when a loader fails. This allows the framework's built-in `ErrorBoundary` to gracefully handle the UI state.
  :::

#### 3. Create Reusable UI Components

A clean codebase is built on small, reusable components. Let's create the visual pieces for our home page.

- [ ] **Create a `PostCard` component**

  ```bash
  mkdir -p app/components
  touch app/components/PostCard.tsx
  ```

  This component will display a single post. Note how its `post` prop is typed with the `Post` type we inferred from our Zod schema.

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
          className="w-full h-auto"
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

- [ ] **Create a placeholder `Header` component**

  ```bash
  touch app/components/Header.tsx
  ```

  ```tsx title="app/components/Header.tsx"
  export function Header() {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <nav className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Instagram</h1>
          {/* Placeholder for icons */}
          <div className="text-xl">❤️</div>
        </nav>
      </header>
    );
  }
  ```

- [ ] **Create a placeholder `BottomNav` component**
  ```bash
  touch app/components/BottomNav.tsx
  ```
  ```tsx title="app/components/BottomNav.tsx"
  export function BottomNav() {
    return (
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
          {/* Placeholders for nav icons */}
          <div className="inline-flex flex-col items-center justify-center px-5">
            🏠
          </div>
          <div className="inline-flex flex-col items-center justify-center px-5">
            🔍
          </div>
          <div className="inline-flex flex-col items-center justify-center px-5">
            ➕
          </div>
          <div className="inline-flex flex-col items-center justify-center px-5">
            {" "}
            Reels{" "}
          </div>
          <div className="inline-flex flex-col items-center justify-center px-5">
            👤
          </div>
        </div>
      </footer>
    );
  }
  ```

#### 4. Render the Page Component

Finally, let's build the `Home` component that ties everything together.

- [ ] **Update `app/routes/home.tsx` to render the UI**
      We'll use the `useLoaderData` hook to get the posts and then map over them to render our `PostCard` components.

  ```tsx title="app/routes/home.tsx"
  import { useLoaderData } from "react-router";
  import { api } from "~/services/api";
  import { postsSchema, type Post } from "~/schemas/post.schema";
  import { PostCard } from "~/components/PostCard";
  import { Header } from "~/components/Header";
  import { BottomNav } from "~/components/BottomNav";

  export async function loader() {
    // ... same loader code as before
    try {
      const response = await api.get("/posts");
      const posts = postsSchema.parse(response.data);
      return posts;
    } catch (error) {
      console.error("Failed to load posts:", error);
      throw new Response("Could not load posts.", { status: 500 });
    }
  }

  // This is the actual page component.
  export default function Home() {
    // The `useLoaderData` hook provides the data returned from the loader.
    // It is automatically typed based on the return type of the loader function.
    const posts = useLoaderData() as Post[];

    return (
      <div className="bg-gray-50 pb-20">
        <Header />
        <main className="container mx-auto pt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
        <BottomNav />
      </div>
    );
  }
  ```

---

### Verification

1.  **Start your backend server** from Day 2.
2.  **Start your frontend dev server** with `bun dev`.
3.  Navigate to `http://localhost:5173/home`.

If you have posts in your backend database, you should see them rendered on the page inside `PostCard` components!

---

### Conclusions

Today was a huge leap forward. You've implemented one of the most fundamental patterns in modern web development.

1.  **Co-located Data Loading**: By placing the `loader` function in the same file as the `Home` component, the logic for what data this route needs is right next to the code that renders it. This is a common pattern and the whole reason JSX exists, to have your behaviour and your templates tightly coupled.

2.  **Frontend as a Gatekeeper**: You didn't just trust the API. By using **Zod** to validate the incoming `response.data`, you've made your frontend resilient. If the backend API changes or sends malformed data, your application won't crash with a cryptic `undefined is not a function` error. Instead, your `loader` will fail gracefully and your `ErrorBoundary` will be displayed.

3.  **Type Safety from End to End**: Notice the journey of our `Post` type. We defined it once in `post.schema.ts` by inferring it from our Zod schema. Then, `useLoaderData` provided that type to our component, which then passed it down as a prop to `<PostCard />`. At no point did we have to manually declare the type of our data—it flowed automatically from the validator, giving us full autocompletion and type-checking.

4.  **Component-Based Architecture**: You broke down the UI into logical, reusable pieces (`Header`, `BottomNav`, `PostCard`). This is the essence of React. Now, if you need to change how a post looks, you only have to edit one file.

You now have a fully functioning data-driven route. This pattern of **loader -> validation -> component rendering** will be the foundation for almost every other feature we build.
