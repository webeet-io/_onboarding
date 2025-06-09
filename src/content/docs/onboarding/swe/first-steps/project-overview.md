---
title: Project Overview
sidebar:
  order: 3
description: Starting point in your software engineering journey with webeet.
---

# Instagram Clone Project Plan (SSR Edition)

## Project Overview

Build a simplified, server-rendered Instagram clone over 9 days. This project is designed for a junior-to-mid-level developer, with each day representing a focused 5-hour task. The primary goal is to build a modern, full-stack application using TypeScript, emphasizing reusable components and robust, type-safe error handling.

### Core Technologies:

- **API Framework**: Fastify
- **Type-Safe Services**: @amparo/fastify for structured backend services
- **Error Handling**: @amparo/core on both frontend and backend for unified, try/catch-free error handling
- **Frontend**: React with react-router-v7 (Remix-style patterns)
- **Database**: MySQL
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Jest
- **Language**: TypeScript

## The 9-Day Development Plan

### Day 1: Full-Stack Project & SSR Foundation

**Goal**: Initialize the project and render a basic page from the server.

**Tasks**:

- Set up a monorepo structure (e.g., folders for `api` and `client`).
- Initialize the Fastify backend with TypeScript.
- Configure the React frontend with Vite and react-router-v7.
- Implement a basic SSR mechanism where the Fastify server renders the initial React app.
- Create a single "Hello World" route (`/`) to confirm the SSR setup is working.

### Day 2: Database Schema & API Contracts

**Goal**: Define the data structures for the entire application.

**Tasks**:

- Set up a local MySQL database instance.
- Design the database schema: `users`, `posts`, `highlights`, `tags`.
- Write the SQL scripts to create these tables.
- Define API contracts using Zod for all data models (e.g., `UserSchema`, `PostSchema`). These will be used for validation in the backend and for type safety in the frontend.
- Populate the database with some seed data for development.

### Day 3: Backend - User Profile & Post Endpoints

**Goal**: Build the core API endpoints for the main profile page.

**Tasks**:

- Integrate `@amparo/fastify` into the backend for structured routing and services.
- Create the API endpoint to fetch user profile data (`GET /api/users/:username`).
- Create the API endpoint to fetch a user's posts (`GET /api/users/:username/posts`).
- Use `@amparo/core` to wrap service logic, providing a consistent `[data, error]` tuple as a return value, eliminating the need for try/catch.

### Day 4: Frontend - Building the Profile Page UI

**Goal**: Create the main profile page structure and fetch data via SSR.

**Tasks**:

- Set up the main home route (`/`) in react-router-v7.
- Use react-router's loader function on the home route to fetch the user profile and posts data from the API on the server.
- Handle the `[data, error]` response from the API call gracefully within the loader.
- Build the static JSX structure for the profile page: `ProfileHeader`, `Stats`, and a placeholder for the content tabs (`Grid`, `Reels`, `Tagged`).
- Style the page with CSS (e.g., CSS Modules or a simple CSS file).

### Day 5: Componentization & Reusable Grid

**Goal**: Refactor the UI into reusable components and display posts.

**Tasks**:

- Break down the profile page into smaller, reusable components: `ProfileHeader`, `StatItem`, `PostGrid`, `PostThumbnail`.
- Implement the `PostGrid` to display the fetched posts in a responsive grid layout.
- Introduce zustand to manage the state of the active tab (`Grid`, `Reels`, `Tagged`) on the client side.

### Day 6: Implementing Tabbed Routes (Reels & Tagged)

**Goal**: Build out the different content views on the profile page.

**Tasks**:

- Create the backend endpoints for fetching reels (`GET /api/users/:username/reels`) and tagged posts (`GET /api/users/:username/tagged`).
- Implement the nested routes for the profile page: `home/reels/grid` and `home/tagged/grid`.
- Use the existing `PostGrid` component to render the content for each tab, fetching the appropriate data using the route loaders. This reinforces the concept of component reuse.

### Day 7: Building the "Feed" View

**Goal**: Create a detailed view for individual posts.

**Tasks**:

- Implement the dynamic "feed" routes: `home/reels/feed` and `home/tagged/feed`. These routes will render a list/feed view instead of a grid.
- Create a new reusable `PostCard` component that shows post details (image, caption, user, etc.).
- Use the `PostCard` component to build the feed layouts for the new routes.

### Day 8: Implementing Highlights

**Goal**: Add the story highlights feature.

**Tasks**:

- Create the backend endpoint to fetch a user's highlights (`GET /api/users/:username/highlights`).
- Build a `HighlightsBar` component on the profile page to display the highlight circles.
- Implement the dynamic route `home/highlights/:highlightId` to view a specific highlight.
- Use zustand to manage the state of the highlight viewer (e.g., opening/closing it in a modal, tracking the current story).

### Day 9: Testing & Final Polish

**Goal**: Ensure application quality and add finishing touches.

**Tasks**:

- Set up jest for both the backend and frontend.
- Write unit tests for a critical API service (e.g., the user profile service), testing both success and error cases handled by `@amparo/core`.
- Write a component test for a key UI component (e.g., `PostGrid` or `ProfileHeader`).
- Perform a final code review and clean-up.
- Write a brief `README.md` explaining how to set up and run the project.
