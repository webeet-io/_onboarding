---
title: Branch Naming Conventions
sidebar:
  order: 3
description: How we name our branches to keep our workflow organized and clear.
---

A consistent naming convention for our Git branches is essential. It brings clarity, organization, and predictability to our workflow, making it easier for everyone to understand the purpose of a branch at a glance.

Our strategy is built around a simple hierarchy: long-lived **Feature Branches** that act as containers for smaller, actionable **Task Branches**.

---

### The Two Branch Types

#### 1. Feature Branch

A Feature Branch represents a complete feature or a significant piece of work (e.g., the entire "interactive map" or "user authentication flow").

- **Purpose**: To group all related work for a single feature. All smaller task branches for that feature will be merged into this branch.
- **Who Creates It**: Usually a Team Lead during the planning phase.
- **Merges Into**: `development` (only after all its child Task Branches are completed and merged).

#### 2. Task Branch (Sub-Branch)

A Task Branch is where you will do your day-to-day work. It represents a single, logical piece of a larger feature.

- **Purpose**: To implement the Branch issue you were assigned to, according to its acceptance criteria.
- **Who Creates It**: You! When you start working on a "Branch Issue".
- **Merges Into**: Its parent **Feature Branch**.

---

### The Naming Convention

#### Feature Branches

The name describes the overall feature and follows the conventional commit standard for its type.

- **Format**: `type/feature-description`
- **`type`**: The nature of the change (`feat`, `fix`, `refactor`, `chore`, etc.), will usually be `feat`.
- **`feature-description`**: A short, kebab-case (`use-dashes-not-spaces`) summary of the feature.

**Example:**

```
feat/interactive-map-interface
```

<Aside type="note">
This main Feature Branch is what a Team Lead will ultimately review and merge into `development` after all the individual tasks have been completed and merged into it.
</Aside>

#### Task Branches (Your Working Branches)

A Task Branch name always starts with a single underscore (`_`) and includes the name of its parent Feature Branch.

- **Format**: `_/parent-branch-name/task-description`
- **`_`**: The prefix that identifies this as a Task Branch.
- **`parent-branch-name`**: The full name of the parent Feature Branch.
- **`task-description`**: A kebab-case summary of the specific task.

**Example:**

```
_/feat/interactive-map-interface/create-map-container
```

#### Sub-Task Branches (Rare)

In rare cases, a task might be complex enough to require its own sub-tasks. These branches start with a double underscore (`__`).

- **Format**: `__full-feature-branch-name/task-branch-name/sub-task-description`
- **`__`**: The prefix that identifies this as a sub-task branch.
- **`full-feature-branch-name`**: The name of the **grandparent** feature branch, including its type (usually `feat`).
- **`task-branch-name`**: The name of the **parent** task branch.
- **`sub-task-description`**: A kebab-case summary of the even smaller task.

**Example:**

```
__feat/interactive-map-interface/create-map-container/add-loading-spinner
```

---

### Workflow in Practice

Here’s how it all comes together:

1.  A **Feature Branch** is created by a lead to house a new feature (e.g., `feat/user-profile-page`).
2.  You are assigned a task to add an avatar. You create your **Task Branch** from the Feature Branch:
    - `_feat/user-profile-page/add-avatar-component`
3.  You complete your work on your Task Branch and open a Pull Request.
4.  Your PR's goal is to merge `_feat/user-profile-page/add-avatar-component` **into** `feat/user-profile-page`.
5.  This process repeats for all other tasks related to the user profile page.
6.  Once all Task Branches are complete and merged into the Feature Branch, the final `feat/user-profile-page` branch is reviewed and merged into `development`.
