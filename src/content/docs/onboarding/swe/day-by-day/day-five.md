---
title: Day Five
sidebar:
  order: 5
description: Starting point in your software engineering journey with webeet.
---

## Implementing the Reels Module

**Focus**: Build the backend `reels` module to serve data for the reels grid and feed, then implement the corresponding frontend routes and components.

---

### Backend Milestones (Repo 1) ✅

- **Create the `reels` Module**
  - [ ] Create the directory `src/modules/reels`.
  - [ ] Inside, create `reels.types.ts` with a Zod schema for a Reel.
  - [ ] Update the database init script to create a `reels` table and seed it with data.
  - [ ] Implement `reels.service.ts` with `getAllReelsForGrid()` and `getAllReelsForFeed()` methods.
  - [ ] Implement `reels.controller.ts` to connect the service methods to request handlers.
  - [ ] Implement `reels.routes.ts` to define the `GET /reels/grid` and `GET /reels/feed` endpoints. Ensure the module is loaded by the server.

### Frontend Milestones (Repo 2) ✅

- **Create Nested Reels Routes**

  - [ ] Create the file `app/routes/home.reels.grid.tsx`.
  - [ ] Create the file `app/routes/home.reels.feed.tsx`.

- **Implement Data Fetching**

  - [ ] In `grid.tsx`, add a `loader` to fetch from `/api/reels/grid`.
  - [ ] In `feed.tsx`, add a `loader` to fetch from `/api/reels/feed`.
  - [ ] Use `amparo-core` and a Zod `Reel` schema for safe fetching and validation.

- **Create Reels Components**

  - [ ] In `app/components`, create `ReelGridItem.tsx` (thumbnail).
  - [ ] In `app/components`, create `ReelFeedPlayer.tsx` (full player).

- **Render the UI**
  - [ ] In `grid.tsx`, render a grid of `ReelGridItem` components.
  - [ ] In `feed.tsx`, render a vertical feed of `ReelFeedPlayer` components.
  - [ ] Add UI to navigate between the reel views.
