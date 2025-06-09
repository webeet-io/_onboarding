---
title: Day Four
sidebar:
  order: 4
description: Starting point in your software engineering journey with webeet.
---

## Building the Home Page

**Focus**: Create the main `/home` page, fetch data from the backend's `posts` module in a Remix `loader`, and render it using reusable components.

---

### Milestones ✅

- **Create the Home Route**

  - [ ] Create a new route file at `app/routes/home.tsx`.
  - [ ] This will automatically handle the `/home` URL.

- **Implement the Loader for Data Fetching**

  - [ ] In `app/routes/home.tsx`, export a `loader` function.
  - [ ] Inside the `loader`, use your Axios service to call the backend's `GET /api/posts` endpoint.
  - [ ] Wrap the API call with `amparo-core`'s `Result.fromAsync` to safely handle success and error states.
  - [ ] If the call is successful, return the data using Remix's `json` utility. If it fails, throw a `Response` or handle the error appropriately.

- **Validate Data with Zod**

  - [ ] Create a `post.schema.ts` file in `app/schemas` that mirrors the backend's `Post` schema from `posts.types.ts`.
  - [ ] In the `loader`, after fetching the data, use the Zod schema to parse and validate it (`.safeParse` or `.parse`).

- **Create Reusable Components**

  - [ ] In `app/components`, create a `Header.tsx` component.
  - [ ] In `app/components`, create a `PostCard.tsx` component that accepts a post object as a prop and displays its content.
  - [ ] In `app/components`, create a `BottomNav.tsx` component with placeholder navigation links.

- **Render the Page**
  - [ ] In the `Home` component within `app/routes/home.tsx`, use the `useLoaderData` hook to access the posts fetched by the `loader`.
  - [ ] Map over the posts array and render a `PostCard` for each one.
  - [ ] Add the `Header` and `BottomNav` components to the page layout.
