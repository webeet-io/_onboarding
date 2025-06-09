# Instagram Clone Project Plan

<aside>
<img src="https://www.notion.so/icons/binoculars_red.svg" alt="https://www.notion.so/icons/binoculars_red.svg" width="40px" />

## Project Overview

Build a simplified Instagram clone that will evolve through different technologies per sprint:

1. Start with static HTML/CSS 👈
2. Progress to a React SPA
3. Add a Fastify API backend
4. Migrate the frontend to Remix
    1. Use Nginx as a reverse proxy to serve both applications on an aws linux instance
</aside>

<aside>
<img src="https://www.notion.so/icons/grocery_yellow.svg" alt="https://www.notion.so/icons/grocery_yellow.svg" width="40px" />

## Attachments:

[Vanilla JavaScript](https://www.notion.so/Vanilla-JavaScript-1cc4d699899c80f9ba1ced2938a9d3d8?pvs=21)

[BEM](https://getbem.com/introduction/) Docs

</aside>

## Sprint 1: Semantic HTML, BEM & Imperative JS

### Day 1: Project Setup & HTML Structure

- Set up local development environment (`Node.js`, `npm`, `SQLite`(not needed for the first 3 days))
- Configure Git repository
- Create basic project structure
- Build **mobile first** Semantic HTML skeleton for profile page. Add BEM classes to each element. Include:
    - Profile header (everything above gallery)
    - Gallery
- Set up basic CSS **file structure** for **BEM** methodology

### Day 2-3: Mobile-First UI with BEM CSS

- Implement profile header using BEM naming conventions.
- Create responsive post grid layout (focusing on mobile first)
- Build UI components (buttons, cards, navigation) with BEM
- Add placeholder content
- Implement responsive breakpoints for tablet/desktop views

### Day 4-5: Vanilla JavaScript & SQLite Database

- Create SQLite database schema and initialize it
- Implement tables for users, posts, comments, and likes
- Set up a simple Node.js server that serves both static files and database access
- Use imperative JavaScript for DOM manipulation and event handling
- Submit forms directly to server endpoints for database operations
- Use page reloads for data updates rather than AJAX in this phase
- Add seed data for development

**Sprint 1 Deadline: April 13**