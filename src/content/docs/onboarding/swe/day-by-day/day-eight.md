---
title: Day Eight
sidebar:
  order: 8
description: Starting point in your software engineering journey with webeet.
---

## Comprehensive Module-Based Testing

**Focus**: Ensure application stability by writing tests co-located within each module for both the backend API and the frontend components.

---

### Backend Testing (Repo 1) ✅

- **Adopt a Module-Based Testing Strategy**

  - [ ] For each module (e.g., `posts`, `reels`), ensure a `tests` subdirectory exists.
  - [ ] The goal is to test each module in isolation as much as possible.

- **Write Module Tests**
  - [ ] In `src/modules/posts/tests`, write comprehensive tests for `posts.routes.test.ts`. Cover success cases, 404 errors for non-existent posts, and the `POST /:id/like` endpoint.
  - [ ] In `src/modules/reels/tests`, write tests for both the grid and feed endpoints.
  - [ ] In `src/modules/highlights/tests`, write tests for both the list and the dynamic `:id` endpoints.
  - [ ] Use the `bun test` command to run all tests.

### Frontend Testing (Repo 2) ✅

- **Configure Bun Test Runner**

  - [ ] Verify the project is set up to use `@testing-library/react` and `@testing-library/jest-dom` with Bun's test runner.

- **Test UI Components**

  - [ ] Create `*.test.tsx` files for critical components like `PostCard.tsx`, `Header.tsx`, and `HighlightBubble.tsx`.
  - [ ] Write tests to verify components render correctly based on props. Test the "like" button interaction in `PostCard` by mocking the Zustand store.

- **Test Remix Loaders**
  - [ ] Write integration tests for key `loader` functions (e.g., in `home.tsx`).
  - [ ] Mock the Axios service to control the API responses and test how the loader handles both successful data fetching and API errors.
  - [ ] Run all frontend tests via `bun test`.
