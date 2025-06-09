---
title: Day Seven
sidebar:
  order: 7
description: Starting point in your software engineering journey with webeet.
---

## Client-Side State & Extending Modules

**Focus**: Add interactive features by extending an existing backend module and managing client-side state optimistically with Zustand.

---

### Backend Milestones (Repo 1) ✅

- **Extend the `posts` Module**
  - [ ] Open the `src/modules/posts` directory.
  - [ ] In `posts.routes.ts`, add a new route definition for `POST /posts/:id/like`.
  - [ ] In `posts.controller.ts`, add a new `likePost` method.
  - [ ] In `posts.service.ts`, add a `likePost(id)` method that contains the business logic to update a post's like count in the database.

### Frontend Milestones (Repo 2) ✅

- **Set Up Zustand Store**

  - [ ] In `app/stores`, create a `postStore.ts` file.
  - [ ] Define a store with state for posts and an action to `toggleLike`.
  - [ ] The `toggleLike` action should optimistically update the local state of a post's `isLiked` status and `likeCount`.

- **Implement Optimistic UI in `PostCard`**

  - [ ] In the `PostCard.tsx` component, add a "Like" button.
  - [ ] Connect the component to the Zustand store. The button's visual state (liked/unliked) should come from the store.
  - [ ] On click, the button should:
    1.  Call the `toggleLike` action from the Zustand store for an instant UI update.
    2.  Make an `axios.post` call to the backend's `/api/posts/:id/like` endpoint in the background (fire-and-forget).

- **Refactor & Polish**
  - [ ] Review all components for opportunities to refactor into more generic, reusable components.
  - [ ] Perform a general UI/CSS polish across all implemented pages.
