---
title: Day Six
sidebar:
  order: 6
description: Starting point in your software engineering journey with webeet.
---

## Implementing Tagged & Highlights Modules

**Focus**: Build out the remaining backend content modules (`tagged`, `highlights`) and their corresponding frontend routes, including a dynamic route.

---

### Backend Milestones (Repo 1) ✅

- **Create `tagged` and `highlights` Modules**
  - [ ] Create the module directory `src/modules/tagged`. Implement its service, controller, and routes for `GET /tagged/grid` and `GET /tagged/feed`.
  - [ ] Create the module directory `src/modules/highlights`. Implement its service, controller, and routes.
  - [ ] The `highlights` module needs two routes:
    - `GET /highlights` (for the list).
    - `GET /highlights/:id` (for a single highlight).
  - [ ] Update the database schema and seed script for the new data types.

### Frontend Milestones (Repo 2) ✅

- **Create Tagged Routes & Components**

  - [ ] Create route files `app/routes/home.tagged.grid.tsx` and `app/routes/home.tagged.feed.tsx`.
  - [ ] Implement their `loader` functions and render the UI.

- **Create Highlights List Route**

  - [ ] Create `app/routes/home.highlights.tsx`.
  - [ ] Implement its `loader` to fetch from `/api/highlights`.
  - [ ] Create a `HighlightBubble.tsx` component that links to its detailed view (e.g., `/home/highlights/some-id`).

- **Create Dynamic Highlight Detail Route**
  - [ ] Create the dynamic route `app/routes/home.highlights.$id.tsx`.
  - [ ] Implement a `loader` that uses the `params.id` to fetch from `/api/highlights/:id`.
  - [ ] Create a `HighlightStory.tsx` component to display the detailed view.
