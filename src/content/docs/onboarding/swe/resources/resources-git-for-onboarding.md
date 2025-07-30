---
title: Git for the Onboarding Project
sidebar:
  order: 5
description: Your workflow of using Git while working on our onboarding project
---

This page describes the workflow you will use while working on the Onboarding Project. You can refer back to it at the end of each day of the onboarding.

---

### Git Repository Setup: Dual Remotes for Portfolio & Review

This workflow ensures you have a personal, public GitHub repository for your portfolio, while also allowing daily review through our company's central repository. You will manage two "remotes" for each of your projects (backend and frontend).

**For both your `insta-clone-fastify-backend` and `insta-clone-react-frontend` projects, follow these steps:**

1.  **Create your Personal GitHub Repository (Portfolio):**
    - Go to your personal GitHub account.
    - Create a **new, empty public repository** for your backend project (e.g., `insta-clone-fastify-backend`). Do NOT initialize it with a README or license.
    - Repeat this for your frontend project (e.g., `insta-clone-react-frontend`).
    - These will be your `portfolio` remotes.

2.  **Connect to Both Remote Repositories:**
    Navigate into your newly created project directory (e.g., `cd insta-clone-fastify-backend`). Then, add both remotes:
    - **Add your Personal Portfolio Remote:**
      ```bash
      git remote add portfolio https://github.com/<your-github-username>/insta-clone-backend
      ```
    - **Add the Organization's Review Remote:**
      ```bash
      git remote add webeet https://github.com/webeet-io/insta-clone-backend.git
      ```
    - **Verify your remotes:**
      ```bash
      git remote -v
      # You should see both 'webeet' and 'portfolio' remotes listed.
      ```
    - **_Important_**: Make sure you've sent your Team Lead your GitHub account so that they can add you to our organization on GitHub.

3.  **Initial Push of your Local `main` Branch to Portfolio:**
    Your local `main` branch will reflect the clean initial setup. Push this to your personal GitHub repo.
    ```bash
    git push -u portfolio main
    ```
    This ensures your `main` branch on your personal GitHub is set up as your portfolio's base.
4.  **Repeat for your `insta-clone-react-frontend` repository:** Navigate into your frontend project directory (e.g., `cd insta-clone-react-frontend`). Then, add both remotes:
    - **Add your Personal Portfolio Remote:**
      ```bash
      git remote add portfolio https://github.com/<your-github-username>/insta-clone-frontend
      ```
    - **Add the Organization's Review Remote:**
      ```bash
      git remote add webeet https://github.com/webeet-io/insta-clone-frontend.git
      ```
    - **Verify your remotes:**
      ```bash
      git remote -v
      # You should see both 'webeet' and 'portfolio' remotes listed.
      ```

5.  **Initial Push of your Local `main` Branch to Portfolio:**
    Your local `main` branch will reflect the clean initial setup. Push this to your personal GitHub repo.
    ```bash
    git push -u portfolio main
    ```
    This ensures your `main` branch on your personal GitHub is set up as your portfolio's base.

### Daily Branch Workflow: Your Branches, Your Review

You will work with three local branches: `main` (for portfolio), `<your-name>` (your development integration branch), and `_<your-name>/day-<number>` (your daily work branch, notice the underscore in the beginning of the branch name).

For example, on Day 2, Sam will have the following branches:

- `main` (tracking the portfolio remote which is on her private GitHub)
- `sam` (tracking webeet's remote)
- `_sam/day-2` (tracking webeet's remote)

**Day One Git Workflow:**

1.  **Create your personal development branch (`<your-name>`):**
    This branch will be the direct target of your daily PRs on the company repo, and will house your latest _reviewed_ work before it goes to `main` for your portfolio.

    ```bash
    git switch -c <your-name>
    ```

    Now, push this new branch to the webeet remote.

    ```bash
    git push -u webeet <your-name>
    ```

2.  **Create your daily work branch (`<your-name>/day-1`):**
    From your new `<your-name>` branch, create a new branch specifically for Day 1's work.

    ```bash
    git switch -c _<your-name>/day-1
    ```

    This branch will automatically track the corresponding remote branch on the `webeet` remote when you push it for the first time.

3.  **Perform and Commit Day 1's work:**
    As you complete the milestones for Day 1, make frequent commits to this `<your-name>/day-1` branch.

    ```bash
    git add .
    git commit -m "feat: completed backend setup and initial post creation"
    ```

4.  **Push your daily branch for review:**
    Push your daily work to the **webeet remote**. This creates the `_<your-name>/day-1` branch on the organization's repository, ready for review.

    ```bash
    git push -u webeet _<your-name>/day-1
    ```

5.  **Create a Pull Request (PR) for Review:**
    - Go to the **organization's repository** on GitHub (the `webeet` remote).
    - Navigate to the "Pull requests" tab.
    - Click "New pull request".
    - **Crucially:** Ensure the **base branch** for your PR is _your_ `<your-name>` branch on the `webeet` remote (e.g., `base: <your-name> <- compare: _<your-name>/day-1`).
    - Add a clear title (e.g., "Day 1: Backend Setup & Post Creation") and a description of what you accomplished.
    - Assign your Lead for review.

**After PR Approval and Merge (by your Lead on the `webeet` remote):**

1.  **Update your local personal development branch (`<your-name>`):**
    Switch back to your local `<your-name>` branch and pull the changes that were just merged into it on the `webeet` remote.
    ```bash
    git switch <your-name>
    git pull webeet <your-name>
    ```
2.  **Integrate daily work into your portfolio's `main` branch:**
    - Switch to your local `main` branch.
    - Merge your `<your-name>` branch into `main`.

    ```bash
    git switch main
    git merge <your-name>
    ```

    - Push the updated `main` branch to your personal `portfolio` remote. This updates your public portfolio.

    ```bash
    git push portfolio main
    ```

    You are now ready to start the next day from your updated local `<your-name>` branch!

    Don't forget to create a new branch named `_<your-name>/day-<next-day-number>`!

---
