---
title: Day Five
sidebar:
  order: 5
description: Applying features across the app and preparing for portfolio showcase.
---

## Feature Integration, Styling Refinement & Portfolio Showcase

Welcome to Day Five, your final day of the core onboarding project! Today, we'll solidify your understanding by integrating the advanced features and styling concepts you learned on Day Four across your entire frontend application. Finally, you'll prepare your project for presentation, either by showcasing it directly from a provided portfolio repository or integrating it into your own.

---

### Milestones ✅

#### 1. Apply Styling to All Frontend Modules

- [ ] **Comprehensive Styling Review:**
      Go through _all_ your frontend components and routes (`Header.tsx`, `BottomNav.tsx`, `PostCard.tsx`, `ProfileLayout.tsx`, `ReelGridItem.tsx`, `HighlightBubble.tsx`, `HighlightStory.tsx`, `CreatePostForm.tsx`, and all your route components like `profile.posts.grid.tsx`, `profile.reels.grid.tsx`, `profile.tagged.grid.tsx`, `profile.highlights.tsx`, `profile.highlights.$id.tsx`).
  - Ensure consistent use of Tailwind CSS utility classes for a cohesive look and feel.
  - Pay attention to responsiveness for different screen sizes.
  - Aim for a polished, Instagram-like aesthetic, refining padding, margins, colors, fonts, and component spacing.

#### 2. Extend File Uploads & Actions (Optional, for advanced interns)

This is an extension task for those who want an extra challenge and deeper understanding of `action` functions and `FormData`.

- [ ] **(Optional) Implement "Edit Profile Picture" with Image Upload:**
  - **Backend:** Add an endpoint (`PUT /users/profile-picture`) that accepts a file upload and updates a user's profile picture URL in the database. You'll need to create a `users` module or extend an existing one if you have user authentication.
  - **Frontend:** Create a UI element (e.g., on the `/profile` page) that allows users to upload a new profile picture. Use a React Router `action` to handle the file upload and send it to your new backend endpoint.

- [ ] **(Optional) Implement "Edit Post Caption" (using `action`):**
  - **Backend:** Add a `PUT /posts/:id` endpoint that accepts a JSON body to update a post's caption.
  - **Frontend:** Modify your `PostCard` or create a new "Edit Post" form that uses a React Router `action` to send the updated caption to the backend. This will reinforce the concept of data mutations via `action` functions.

#### 3. Portfolio Showcase Preparation

The ultimate goal of this project is to provide you with a tangible piece for your portfolio.

- [ ] **Option A: Use Webeet's Portfolio Repo (Recommended)**
  - Your mentor will provide you with access to a dedicated portfolio repository.
  - Clone this repository.
  - Follow the instructions within that repository's `README.md` to integrate your `insta-clone-react-frontend` and `insta-clone-fastify-backend` projects. This might involve setting up submodules, copying files, or configuring deployment scripts within the portfolio repo.
  - Ensure the portfolio repository's deployment (e.g., to Vercel or Netlify for the frontend, and Render/Railway for the backend) correctly points to and runs your projects.

- [ ] **Option B: Integrate into Your Personal Portfolio (If you have one)**
  - If you already maintain a personal portfolio website, discuss with your mentor how best to integrate this project.
  - This might involve creating a dedicated sub-domain, deploying your project as a separate application, or linking to its live Vercel/Render deployments.
  - Create a detailed `README.md` for both your `insta-clone-react-frontend` and `insta-clone-fastify-backend` repositories. These READMEs should clearly:
    - Describe the project's purpose and features.
    - List the technologies used (TypeScript, React Router v7, Fastify, Jest, SQLite, Amparo, Zod, Zustand, Tailwind CSS, Vercel).
    - Explain the modular architecture (for the backend) and component/routing patterns (for the frontend).
    - Provide clear setup and running instructions for both local development and deployed versions.
    - Include screenshots or a GIF demonstration of the application.
    - Highlight key learnings and challenges overcome during development.

#### 4. Project Review & Refinement

Use the remainder of the day to polish your code and documentation.

- [ ] **Code Cleanup:**
  - Remove any unused imports, variables, or commented-out code.
  - Ensure consistent formatting across all files (run Prettier and ESLint one last time!).
  - Add meaningful comments to complex logic or non-obvious sections.
- [ ] **Review and Improve:**
  - Test all features end-to-end one last time.
  - Look for opportunities to make your code more readable, efficient, or robust.
  - Ensure all `TODO` comments or temporary notes have been addressed.

---

### Conclusions

Congratulations on completing your onboarding project! You've gone from foundational setup to building complex full-stack features, deploying your application, and preparing it for your professional portfolio.

**Key Achievements:**

- **Full-Stack Proficiency:** You've built a robust application using TypeScript, React, Fastify, and SQLite.
- **Test-Driven Development (TDD):** You've embraced TDD to build features with confidence and maintain code quality.
- **Modern Frontend Development:** You've mastered React Router v7, component-based architecture, and efficient data handling.
- **Backend Engineering:** You've developed modular APIs, handled database interactions, and managed file uploads.
- **Deployment Skills:** You've successfully deployed a full-stack application to production environments.
- **Portfolio Ready:** You now have a tangible, well-documented project to showcase your skills to future recruiters.

This project has provided you with hands-on experience across the entire software development lifecycle at Webeet. We are incredibly proud of your progress and look forward to seeing the amazing contributions you'll make to the team!
