---
title: Git & Our Workflow
sidebar:
  order: 11
description: Our team's guide to using Git effectively in a multi-repo environment.
---

Welcome to the team's guide to Git! Version control is the backbone of collaborative software development. Mastering it is essential for working efficiently as a team. This guide covers our specific workflow and the key commands you'll use daily.

---

### Git vs. GitHub: What's the Difference?

It's a common point of confusion, so let's clarify it first.

- **Git** is the **tool** installed on your computer. It's a distributed version control system that tracks changes to your code locally. Think of it as the engine that powers version control.
- **GitHub** is the **website** where we host our code. It's a platform built around Git that adds a web interface, collaboration features like Pull Requests, and project management tools.

In short: **Git is the command-line tool; GitHub is the cloud-based home for our repositories.**

---

### Local vs. Remote: Your Development Setup 🏡☁️

Our application is built with a microservices architecture, meaning you'll work with multiple repositories simultaneously.

- **Remote (`origin`)**: This is the version of the code living on GitHub. It's the "single source of truth" that everyone on the team shares and contributes to.
- **Local**: This is the copy of the code living on your machine. When you `git clone`, you are creating a local copy of a remote repository.

Your daily setup will look like this:

1.  Create a main folder on your machine for the project (e.g., `webeet-layered-app`).
2.  Inside that folder, you will clone the repositories you need for your task. For example:
    ```bash
    # Inside your layered-app directory
    git clone <url-for-layered-auth-service>
    ```
3.  You will do this whenever you start working on a micro-service (repo) you haven't worked on before. You will then have multiple local repositories, each connected to its own remote on GitHub.

---

### The Core Workflow: From Task to Pull Request 🚀

Here is the step-by-step process you'll follow for almost every task you work on. We practice a form of **Trunk-Based Development**, which means our `development` branch is always the source of truth, and our feature branches are short-lived.

1.  **Get the Latest Code**: Before starting any new work, make sure your local `development` branch is up-to-date with the remote.

    ```bash
    # Switch to the development branch
    git switch development

    # Pull the latest changes from GitHub
    git pull origin development
    ```

2.  **Create Your Feature Branch**: Create a new branch for your task. **Your task description will always specify which branch to use as your base.** While it's often `development`, it might be a larger feature branch like `feat/sign-in`. More on our naming conventions in another page.

    ```bash
    # Navigate to the branch you want to branch out from
    git switch feat/sign-in

    # Create a new branch and switch to it from the correct base branch
    git switch -c _feat/sign-in/google-oaut
    ```

    The `-c` flag creates the new branch. `git switch` will also automatically set your new local branch to "track" its remote counterpart when you push it, which is very convenient.

3.  **Do the Work (Commit Often!)**: Now you can start coding! Make small, logical commits as you work.

    ```bash
    # Stage your changes for commit
    git add <file-with-changes>

    # Commit your changes with a clear message, using conventional commit messages
    git commit -m "feat(auth): implement password hashing during signup"
    ```

4.  **Writing Conventional Commit Messages**: We follow the Conventional Commits standard to keep our history clean and readable. The format is:
    `type(scope): description`

    - **type**: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style`, `refactor`, `test`, `chore` (build changes, etc.).
    - **scope**: The part of the codebase affected (e.g., `auth`, `api`, `payment`).
    - **description**: A short, imperative-tense summary of the change (not past tense).

5.  **Push Your Branch**: When you're ready to share your work or create a Pull Request, push your branch to GitHub.

```bash
    # The -u flag is only needed the very first time you push a new branch.
    # It sets the upstream remote branch.
    git push -u origin <your-branch-name>

    # After setting the upstream once, all future pushes are simpler:
    git push
```

:::tip
Once the upstream is set, you can use `git pull` without any arguments to pull changes for your current branch.
:::

---

### Key Commands Explained 🧠

#### Why We Use `git switch` (and not `git checkout`)

You may have learned `git checkout` in your bootcamp. It's a powerful command, but it does many different things (switches branches, restores files, detaches your `HEAD`), which can be confusing and lead to mistakes.

To make things clearer and safer, Git introduced two new commands to separate these functions:

- `git switch`: Use this **only for changing branches**.
- `git restore`: Use this **only for discarding file changes**.

**Our rule is simple: Always use `git switch` to navigate between branches.** It makes your intention clear and reduces the chance of accidental errors.

#### `git fetch`, `git fetch --prune`, and `git pull`

Keeping your local repository in sync with the remote is crucial.

- `git fetch`: This downloads all the latest information from the remote (new branches, new commits) but **does not** change any of your local files. It's a safe way to see what has changed on the remote before integrating it.
- `git fetch --prune`: When a teammate deletes a branch on GitHub after it's merged, your local repository still holds a "stale" reference to it. Over time, this can clutter your list of branches. `git fetch --prune` cleans up these stale references, keeping your local repository tidy. It's good practice to run this periodically.
- `git pull`: This is essentially a `git fetch` followed immediately by a `git merge`. It downloads the new changes **and** merges them into your current local branch. You'll use this command most often.

### Additional Learning Resources

To deepen your understanding of Git, we highly recommend these courses:

- [boot.dev: Git Course 2 (Advanced)](https://www.boot.dev/learn/learn-git-2)

If that feels too advanced, you can roll back to:

- [boot.dev: Git Course 1 (Introduction)](https://www.boot.dev/learn/learn-git)

To read more about the concepts mentioned above, we recommend these resources:

- [Trunk Based Development](https://dora.dev/capabilities/trunk-based-development/)
- [Conventional Commits](https://www.conventionalcommits.org)
