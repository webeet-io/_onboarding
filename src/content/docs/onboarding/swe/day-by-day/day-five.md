---
title: Day Five
sidebar:
  order: 5
description: Extending our architecture with TDD and safe refactoring.
---

## TDD-Driven Development: The Reels Module

Welcome to Day Five! Today, we will build the backend for our **Reels** feature using the same Test-Driven Development (TDD) discipline we learned on Day Two. This will solidify the Red-Green-Refactor pattern. We will also perform a "TDD-safe refactor" to add a feature we missed, demonstrating how tests provide a safety net when changing existing code.

---

### Backend Milestones (Repo 1: `insta-clone-fastify-backend`) ✅

Our first task is to add a missing endpoint for posts, and we will do it using TDD principles to guide our refactoring.

:::tip[TDD-Safe Refactoring: Adding `GET /posts`]
Before we build our `reels` module, let's fix an issue from a previous day. Our frontend's "Posts Grid" on Day Four needs to fetch all posts from a `GET /posts` endpoint, but on Day Two, we only created the `POST /posts` endpoint.

Your task is to apply the patterns you've already learned in a TDD-safe way:

1.  **Create and see the Test Fail (The "Red" Light)**: First, let's write our test. Add an `it` call inside our test suite in `posts.test.ts`:

    ```typescript
    it("should get all posts and return them with a 201 status code", async () => {});
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

  ```typescript title="src/modules/reels/reels.test.ts"
  import Fastify from "fastify";
  import { reelsRoutes } from "./reels.routes";

  describe("GET /reels/grid", () => {
    it("should return a list of reels with a 200 status code", async () => {
      const app = Fastify();
      const mockReels = [
        {
          id: 1,
          video_url: "http://example.com/video1.mp4",
          thumbnail_url: "http://example.com/thumb1.png",
          caption: "Reel 1",
          views: 100,
        },
        {
          id: 2,
          video_url: "http://example.com/video2.mp4",
          thumbnail_url: "http://example.com/thumb2.png",
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

- [ ] **Run the test and watch it fail**
  ```bash
  npm test
  ```
  It will fail because `reels.routes.ts` doesn't exist. This is our **Red** light. Perfect.

#### Green Phase: Make the Test Pass

Now, we write the minimum amount of code required to make our new test pass. This includes creating the types, updating the database, implementing the service and routes, and loading the module in the server.

- [ ] **Create `reels.types.ts`**
- [ ] **Update `database.plugin.ts` and `database.transactions.ts`**
- [ ] **Implement `reels.service.ts` and `reels.routes.ts`**
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

- [ ] **Create the Reels Schema** (`app/schemas/reel.schema.ts`)
- [ ] **Create the Reel Grid Item Component** (`app/components/ReelGridItem.tsx`)
- [ ] **Create the Reels Grid Route** (`app/routes/profile.reels.grid.tsx`)

---

### Verification

1.  Restart both your backend and frontend servers to apply all changes.
2.  Navigate to `http://localhost:5173/`. You should be redirected to the posts grid at `/profile/posts/grid`.
3.  Click the "Reels" tab in the sub-navigation.
4.  The URL should change to `/profile/reels/grid`, and you should now see the grid of reel thumbnails fetched from your backend.

---

### Conclusions

Look at how quickly you added a new feature! This is the direct benefit of the architecture you built on Day Four.

1.  **Leveraging Existing Layouts**: You didn't need to create any new navigation or layout components. You simply created a new route file (`profile.reels.grid.tsx`), and it was automatically rendered within the correct context by the parent `profile.tsx` layout. This is the power of nested routing.
2.  **A Predictable, Repeatable Pattern**: The process for adding a new data-driven page is now crystal clear:
    1.  Create the backend module (types, db, service, routes).
    2.  Create a Zod schema on the frontend.
    3.  Build the small, reusable UI components.
    4.  Assemble them in a new route file with a `loader`.
        This pattern makes development fast and predictable.
3.  **The Importance of Seeding**: Manually creating data via `curl` is fine for one-off tests, but for developing a UI, having a reliable set of seed data that loads automatically saves a tremendous amount of time and effort.
4.  **Continuous Improvement**: The "Housekeeping" task at the beginning shows that development is an iterative process. We often need to go back and improve or fix previous work as new requirements come to light.
