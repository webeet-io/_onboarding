---
title: Project Overview
sidebar:
  order: 3
description: Starting point in your software engineering journey with webeet.
---

## Instagram Clone Project Plan (rrv7 & Fastify)

### Project Overview

This project is a 9-day plan to build a simplified Instagram clone. It features a **Server-Side Rendered (SSR) frontend** using React Router v7 and a **decoupled backend API** built with Fastify. The architecture emphasizes a clean separation of concerns into two distinct repositories. The backend will follow a **modular, self-sufficient structure** inspired by NestJS, and all error handling will be standardized using the `amparo` library.

### Core Technologies

- **Runtime**: Bun (for backend, frontend, and testing).
- **Backend**: Fastify, TypeScript, SQLite, Zod, `amparo-fastify`.
- **Frontend**: React Router v7 (SSR), TypeScript, Axios, Zustand, Zod, `amparo-core`.
- **Repositories**: Two separate Git repos (frontend vs. backend).

### High-Level Development Plan 🚀

#### **Phase 1: Backend Foundation (Days 1-2)**

- **Objective**: Establish a robust, modular backend API.
- **Key Milestones**:
  - Initialize the Fastify project with a `src/modules` architecture using Bun.
  - Set up the core database service with SQLite.
  - Build the first complete CRUD module (`posts`) including its routes, controller, service, and tests.
  - Create a database seeding script.

---

#### **Phase 2: Frontend & Core Features (Days 3-6)**

- **Objective**: Build the frontend application and implement the main content-viewing features.
- **Key Milestones**:
  - Initialize the React Router v7 frontend project using Bun.
  - Build the main `/home` page, fetching data from the backend API's `/posts` module.
  - Sequentially build the backend modules and corresponding frontend routes for **Reels**, **Highlights** (including dynamic routes), and **Tagged** content.
  - Establish a pattern of creating reusable React components for UI elements.

---

#### **Phase 3: Interactivity & Finalization (Days 7-9)**

- **Objective**: Add client-side interactivity, conduct comprehensive testing, and finalize documentation.
- **Key Milestones**:
  - Introduce client-side state management with Zustand for optimistic UI updates (e.g., "liking" a post).
  - Extend the `posts` module on the backend to handle the new "like" functionality.
  - Write comprehensive, module-based tests for the backend and component/loader tests for the frontend.
  - Create final `README.md` files for both repositories, documenting the architecture and setup procedures.
