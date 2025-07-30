---
title: Day Three
sidebar:
  order: 3
description: Rapidly building features and handling dynamic content for Tagged & Highlights modules.
---

## Feature Expansion: Tagged & Highlights Modules

Welcome to Day Three. Today, you will see how the patterns and architecture we've established allow us to build new features at an incredible speed. Your task is to implement two complete, full-stack modules - `Tagged` and `Highlights` - by applying the TDD workflow and component patterns you've already mastered. Today, the training wheels come off: this guide will describe _what_ to do, but it will be up to you to write the actual code. We will also introduce **dynamic routes** to handle content that has its own unique ID.

---

### Backend Milestones (Repo 1) ✅

Your goal is to create two new, self-contained modules on the backend. For each module, you will follow the full TDD process: write a failing test first, then implement the necessary files to make it pass.

- **Implement the `tagged` Module**
  - [ ] **TDD**: Start by writing a failing test for a `GET /tagged/grid` endpoint in a new `tagged.test.ts` file.
  - [ ] **Types**: Create a `tagged.types.ts` file with a Zod schema for "tagged" posts. A tagged post might include fields from the original post plus the user who tagged you.
  - [ ] **Database**: Update the `database.plugin.ts` to create a `tagged_posts` table and seed it with some sample data. Remember to update `database.transactions.ts` with the necessary helpers.
  - [ ] **Service & Routes**: Implement the `tagged.service.ts` and `tagged.routes.ts` files to make your test pass.
  - [ ] **Server**: Register the new `taggedRoutes` in `server.ts`.

- **Implement the `highlights` Module**
  - [ ] **TDD**: Write failing tests for two new endpoints: `GET /highlights` and `GET /highlights/:id`.
  - [ ] **Types**: Create a `highlights.types.ts` file with a Zod schema for a Highlight (e.g., `id`, `cover_image_url`, `title`).
  - [ ] **Database**: Update the database plugin and transactions file to support creating and retrieving highlights. Remember to seed some data!
  - [ ] **Service & Routes**: Implement the service and routes to handle fetching both the list of all highlights and a single highlight by its ID.
  - [ ] **Server**: Register the new `highlightsRoutes` in `server.ts`.

---

### Frontend Milestones (Repo 2) ✅

On the frontend, your task is to create the routes and components to display the data from your new backend modules. These should slot perfectly into the `/profile` layout.

- [ ] **Create Tagged Route**
  - [ ] Create a new route at `app/routes/profile.tagged.grid.tsx`.
  - [ ] In this file, implement a `loader` function to fetch data from your new `GET /tagged/grid` backend endpoint.
  - [ ] The component should render the tagged posts. You can likely reuse the `<PostCard />` component you've already built!

- [ ] **Create Highlights List Route**
  - [ ] Create a new component, `app/components/HighlightBubble.tsx`. This component should display a highlight's cover image and title, and it should be a `<Link>` that navigates to a unique URL for that highlight (e.g., `/profile/highlights/1`).
  - [ ] Create a new route at `app/routes/profile.highlights.tsx`. This will serve as a layout or list view.
  - [ ] Implement a `loader` to fetch from the `GET /highlights` endpoint.
  - [ ] The component should render a list of the `<HighlightBubble />` components you just created.

- [ ] **Create Dynamic Highlight Detail Route**
  - [ ] Create a new component, `app/components/HighlightStory.tsx`, to display the detailed view of a highlight (e.g., showing the full-screen story).
  - [ ] Create the dynamic route file that will display a single highlight. The filename for this is special: `app/routes/profile.highlights.$id.tsx`. The `$` prefix tells React Router that `id` is a dynamic parameter that will change.
  - [ ] Add the following code to the new file. This is a minimal example of how to access the dynamic parameter in the loader to fetch the correct data.

  <details class="codeblock">
  <summary>Click to show the code for <span>profile.highlights.$id.tsx</span></summary>

  ```tsx title="app/routes/profile.highlights.$id.tsx"
  import { useLoaderData, type LoaderFunctionArgs } from "react-router";
  import { api } from "~/services/api";
  // Assume you have a highlight schema and a HighlightStory component
  // import { highlightSchema, type Highlight } from "~/schemas/highlight.schema";
  // import { HighlightStory } from "~/components/HighlightStory";

  export async function loader({ params }: LoaderFunctionArgs) {
    // The `params` object contains the dynamic parts of the URL.
    // The key (`id`) matches the filename (`$id.tsx`).
    const highlightId = params.id;

    try {
      const response = await api.get(`/highlights/${highlightId}`);
      // return highlightSchema.parse(response.data);
      return response.data; // Replace with schema parsing
    } catch (error) {
      console.error(error);
      throw new Response("Highlight not found", { status: 404 });
    }
  }

  export default function HighlightDetail() {
    const highlight = useLoaderData();
    // Add a typeguard to help typescript understand what the higlhight is if needed

    return (
      <div>
        <h1>{highlight.title}</h1>
        {/* Render your <HighlightStory /> component here */}
      </div>
    );
  }
  ```

  </details>

  :::note[Learn More About Dynamic Routes]
  The `$` in the filename and the `params` object in the loader are the core of dynamic routing. This is a powerful feature for creating pages from dynamic data. For a deeper understanding, we highly recommend reading the official **React Router documentation** on this topic.
  :::

---

### Conclusions

Today, you proved the value of the architecture you've built. By following the established TDD and component patterns, you were able to rapidly add two complete features to the application. You learned how to create modules for different types of content and saw how a well-designed frontend architecture allows you to plug in new pages with minimal effort. Most importantly, you were introduced to dynamic routing, a fundamental concept for building data-driven websites where content lives at unique URLs.

---

### Day Three Complete!

You've rapidly expanded your application with new features and tackled dynamic routing!

---
