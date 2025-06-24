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

- **Adopt a Module-Based Integration Testing Strategy**

  - [ ] Use **Jest** as the exclusive test runner for the backend.
  - [ ] For each test suite, create an isolated, in-memory **Fastify server instance**.
  - [ ] **Mock external dependencies**, such as database helpers (`getUserByAuthMethod`), at the top of the test file using `jest.mock()`.
  - [ ] Use Fastify's `app.inject()` method to simulate live HTTP requests to your routes, testing the full request-response cycle.

- **Write Module Integration Tests**
  - [ ] In `src/modules/posts/tests`, write integration tests for the `posts.routes.test.ts`. Mock the database service and use `app.inject()` to verify status codes and response bodies for success cases, 404 errors, and the `POST /:id/like` endpoint.
  - [ ] Follow the same pattern for the `reels` and `highlights` modules, ensuring each test file is self-contained.
  - [ ] Use the `jest` command to run all backend tests.

---

### Frontend Testing (Repo 2) ✅

- **Configure Jest with React Testing Library**

  - [ ] Verify the project is set up to use **Jest** with `@testing-library/react` and `@testing-library/jest-dom`.

- **Test UI Components**

  - [ ] Create `*.test.tsx` files for critical components like `PostCard.tsx`, `Header.tsx`, and `HighlightBubble.tsx`.
  - [ ] Write tests to verify components render correctly based on props. Test the "like" button interaction in `PostCard` by mocking the Zustand store.

- **Test rrv7 Loaders**
  - [ ] Write integration tests for key `loader` functions (e.g., in `home.tsx`).
  - [ ] Mock the Axios service to control API responses and test how the loader handles both successful data fetching and API errors.
  - [ ] Run all frontend tests via a configured test script (e.g., `npm test`).
