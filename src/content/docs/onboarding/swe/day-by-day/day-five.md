---
title: Day Five
sidebar:
  order: 5
description: Building a full-stack feature module with nested routes.
---

## Implementing the Reels Module

On Day Five, we'll build our second major feature: **Reels**. This will solidify the patterns we've learned and introduce a powerful new concept on the frontend: **nested routes and layouts**. We'll create a complete, self-contained module on the backend and then build the corresponding UI on the frontend, complete with navigation between a grid view and a feed view.

---

### Backend Milestones (Repo 1: `insta-clone-fastify-backend`) ✅

Our first task is to create the entire backend module that will serve our Reels data.

- [ ] **Create the `reels` Module Directory and Types**
      First, we define the "shape" of our data.

  ```bash
  mkdir -p src/modules/reels
  touch src/modules/reels/reels.types.ts
  ```

  In the new types file, we'll use Zod to define what a Reel is.

  ```typescript title="src/modules/reels/reels.types.ts"
  import { z } from "zod";

  export const ReelSchema = z.object({
    id: z.number(),
    video_url: z.string().url(),
    thumbnail_url: z.string().url(),
    caption: z.string().nullable(),
    views: z.number().int().positive(),
  });

  export type Reel = z.infer<typeof ReelSchema>;
  ```

- [ ] **Update the Database and Seed Data**
      We need to tell our database about the new `reels` table. For development, it's also crucial to have some data to work with. We'll add a seeding step.

  Update your database plugin to create the `reels` table and insert some sample data if the table is empty.

  ```typescript title="src/core/database/database.plugin.ts (Updated)"
  // ... imports

  async function databasePluginHelper(fastify: FastifyInstance) {
    const db = new Database("./database.db");
    fastify.log.info("SQLite database connection established.");

    // Create posts table (from Day 2)
    db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      img_url TEXT NOT NULL,
      caption TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);

    // Create reels table
    db.exec(`
    CREATE TABLE IF NOT EXISTS reels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      caption TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `);

    // Seed the reels table if it's empty
    const reelsCount = db
      .prepare("SELECT COUNT(*) as count FROM reels")
      .get() as { count: number };
    if (reelsCount.count === 0) {
      fastify.log.info("Seeding reels table...");
      const insert = db.prepare(
        "INSERT INTO reels (video_url, thumbnail_url, caption, views) VALUES (?, ?, ?, ?)",
      );
      const seedData = [
        [
          "[http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4](http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)",
          "[https://via.placeholder.com/300x500.png?text=Reel+1](https://via.placeholder.com/300x500.png?text=Reel+1)",
          "Funny Bunny!",
          1200,
        ],
        [
          "[http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4](http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4)",
          "[https://via.placeholder.com/300x500.png?text=Reel+2](https://via.placeholder.com/300x500.png?text=Reel+2)",
          "Elephants!",
          2500,
        ],
        [
          "[http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4](http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4)",
          "[https://via.placeholder.com/300x500.png?text=Reel+3](https://via.placeholder.com/300x500.png?text=Reel+3)",
          "Fire!",
          5100,
        ],
      ];
      const insertMany = db.transaction((reels) => {
        for (const reel of reels) insert.run(...reel);
      });
      insertMany(seedData);
    }

    // ... rest of the file (transactions, decorators, etc.)
  }
  ```

- [ ] **Implement the Reels Service and Routes**
      Now, let's create the logic for fetching our reels and the endpoints to expose that logic.

  ```bash
  touch src/modules/reels/reels.service.ts
  touch src/modules/reels/reels.routes.ts
  ```

  First, the service, which will communicate with the database. We'll add it to `database.transactions.ts` first.

  ```typescript title="src/core/database/database.transactions.ts (Updated)"
  // ... inside createTransactionHelpers factory function
  const statements = {
    // ... post statements
    getAllReels: db.prepare("SELECT * FROM reels ORDER BY created_at DESC"),
  };

  const posts = {
    /* ... */
  };

  const reels = {
    getAll: () => {
      return statements.getAllReels.all();
    },
  };

  return {
    posts,
    reels, // Export the new reels transaction helper
  };
  ```

  Now the service can use this new transaction helper.

  ```typescript title="src/modules/reels/reels.service.ts"
  import type { FastifyInstance } from "fastify";

  export const reelsService = (fastify: FastifyInstance) => {
    return {
      // For this example, both grid and feed will return all reels.
      // In a real app, these would have different logic (e.g., pagination for feed).
      getAllReelsForGrid: async () => {
        fastify.log.info(`Fetching all reels for grid`);
        return fastify.transactions.reels.getAll();
      },
      getAllReelsForFeed: async () => {
        fastify.log.info(`Fetching all reels for feed`);
        return fastify.transactions.reels.getAll();
      },
    };
  };
  ```

  And finally, the routes to expose the service methods via HTTP endpoints.

  ```typescript title="src/modules/reels/reels.routes.ts"
  import type { FastifyInstance, FastifyPluginAsync } from "fastify";
  import { reelsService } from "./reels.service";

  const reelsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const service = reelsService(fastify);

    // Endpoint for the grid view
    fastify.get("/reels/grid", async (request, reply) => {
      const reels = await service.getAllReelsForGrid();
      return reels;
    });

    // Endpoint for the feed view
    fastify.get("/reels/feed", async (request, reply) => {
      const reels = await service.getAllReelsForFeed();
      return reels;
    });
  };

  export { reelsRoutes };
  ```

- [ ] **Load the Reels Module**
      Don't forget to tell your main server to use these new routes!

  ```typescript title="src/server.ts (Updated)"
  import { postsRoutes } from "./modules/posts/posts.routes";
  import { reelsRoutes } from "./modules/reels/reels.routes"; // 1. Import

  // ...
  // Register our new posts routes
  fastify.register(postsRoutes);
  fastify.register(reelsRoutes); // 2. Register
  // ...
  ```

---

### Frontend Milestones (Repo 2: `insta-clone-react-frontend`) ✅

With the backend ready, let's build the UI.

- [ ] **Create the Nested Reels Routes**
      We will now create a nested route structure. `home.reels.tsx` will act as a "layout" for the reels section, containing shared UI like navigation. `grid` and `feed` will be children that render inside this layout.

  ```bash
  touch app/routes/home.reels.tsx
  touch app/routes/home.reels.grid.tsx
  touch app/routes/home.reels.feed.tsx
  ```

- [ ] **Implement the Reels Layout and Navigation**
      The `home.reels.tsx` file will define the navigation between "Grid" and "Feed" and provide an `<Outlet>` where the child routes will be rendered.

  ```tsx title="app/routes/home.reels.tsx"
  import { NavLink, Outlet } from "react-router";

  export default function ReelsLayout() {
    const activeLinkStyle = {
      borderBottom: "2px solid black",
      fontWeight: "bold",
    };

    return (
      <div>
        <div className="flex justify-center items-center border-b">
          <NavLink
            to="/home/reels/grid"
            className="flex-1 text-center p-4"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Grid
          </NavLink>
          <NavLink
            to="/home/reels/feed"
            className="flex-1 text-center p-4"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            Feed
          </NavLink>
        </div>
        <main>
          {/* Child routes (grid.tsx or feed.tsx) will render here */}
          <Outlet />
        </main>
      </div>
    );
  }
  ```

- [ ] **Update the Home Page to include a Reels Outlet**
      For the `ReelsLayout` to appear, the main `/home` route needs its own `<Outlet />`. Let's also add a link to the new reels section.

  ```tsx title="app/routes/home.tsx (Updated)"
  // ... imports
  import { Outlet, Link } from "react-router";

  // ... loader

  export default function Home() {
    const posts = useLoaderData() as Post[];

    return (
      <div className="bg-gray-50 pb-20">
        <Header />
        <main className="container mx-auto pt-4">
          <Link
            to="/home/reels/grid"
            className="text-blue-500 mb-4 inline-block"
          >
            View Reels
          </Link>

          {/* The content for /home/reels/... will go here */}
          <Outlet />

          {/* We can hide the posts when viewing reels, or create a more complex layout.
              For now, we just render the posts list above the reels outlet. */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>
        <BottomNav />
      </div>
    );
  }
  ```

- [ ] **Implement Data Fetching for Reels Grid**
      Fetch data in the `grid` route and render a simple grid.

  ```tsx title="app/routes/home.reels.grid.tsx"
  import { useLoaderData } from "react-router";
  import { api } from "~/services/api";
  import { z } from "zod";

  // You should create a shared reel.schema.ts file like you did for posts!
  const ReelSchema = z.object({
    /* ... same as backend ... */
  });
  const ReelsSchema = z.array(ReelSchema);
  type Reel = z.infer<typeof ReelSchema>;

  export async function loader() {
    try {
      const response = await api.get("/reels/grid");
      return ReelsSchema.parse(response.data);
    } catch (error) {
      console.error(error);
      throw new Response("Could not load reels grid", { status: 500 });
    }
  }

  export default function ReelsGrid() {
    const reels = useLoaderData() as Reel[];
    return (
      <div className="grid grid-cols-3 gap-1 mt-4">
        {reels.map((reel) => (
          // In a real app, this would be a <ReelGridItem /> component
          <img
            key={reel.id}
            src={reel.thumbnail_url}
            alt={reel.caption || ""}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
    );
  }
  ```

  _(Note: The exercise to create `ReelGridItem.tsx`, `ReelFeedPlayer.tsx` and the `feed.tsx` route is left for you to complete using the patterns shown here and in Day 4!)_

---

### Conclusions

Day Five was a big step in building a real-world application.

1.  **Full-Stack Modularity**: You created a new, self-contained `reels` module on the backend. This included the database schema, seeding, service logic, and API routes. This pattern is infinitely scalable for adding new features.
2.  **Nested Routes are Layouts**: You saw the true power of React Router's file-based routing. By creating `home.reels.tsx`, you made a layout component that wraps around its children (`grid` and `feed`). The `<Outlet />` is the key that tells the parent where to render the child.
3.  **Active Navigation State**: Using `<NavLink>` instead of `<Link>` gives you access to an `isActive` property, making it trivial to style the currently selected link, a requirement for almost any navigation menu.
4.  **The Power of Seeding**: Manually creating data through `curl` is tedious. By adding a simple seeding script to your database plugin, you guarantee that your development environment always has the data it needs to render pages correctly, which dramatically speeds up frontend development.
