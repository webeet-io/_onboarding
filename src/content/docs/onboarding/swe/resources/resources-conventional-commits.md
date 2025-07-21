---
title: Conventional Commits
sidebar:
  order: 5
description: How to write clean, informative, and machine-readable commit messages.
---

At Webeet, we adhere to the **Conventional Commits** specification for all our projects. This is a simple set of rules for creating an explicit commit history. Following this convention makes our project history easy to read and allows us to automate processes like generating changelogs.

---

### Why Use Conventional Commits?

- **Clarity**: It immediately communicates the intent of a change. A `fix` is different from a `feat`, and seeing that in the history makes it easy to understand the project's evolution.
- **Readability**: A clean, standardized log is invaluable for anyone trying to understand past changes, debug issues, or get up to speed on the project.
- **Automation**: The format is machine-readable, which enables us to automatically generate release notes, determine version bumps (following Semantic Versioning), and integrate with other CI/CD tooling.

---

### The Commit Structure

Every commit message consists of a **header**, an optional **body**, and an optional **footer**.

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### **1. Header (Required)**

The header is the most important part and has a specific format:

- **`<type>`**: Describes the kind of change you've made. See the most common types below.
- **`<scope>`**: A noun describing the section of the codebase the commit affects (e.g., `auth`, `map`, `api`).
- **`<description>`**: A short, imperative summary of the code change. Start with a verb (e.g., `add`, `correct`, `refactor`, `remove`). Do not capitalize the first letter or use past tense (e.g., ~~added~~, ~~created~~).

#### **2. Body (Optional)**

The body can be used to provide additional context, explain the "why" behind the change, and describe previous behavior vs. new behavior.

#### **3. Footer (Optional)**

The footer can reference issues that the commit resolves or to note any breaking changes.

- To close a GitHub issue, use keywords like `Closes #123` or `Fixes #45`.
- To indicate a major, breaking change, start a new line with `BREAKING CHANGE:`.

---

### Common Types

These are the most common types you will use:

| Type           | Description                                                                          |
| :------------- | :----------------------------------------------------------------------------------- |
| **`feat`**     | A new feature for the user.                                                          |
| **`fix`**      | A bug fix for the user.                                                              |
| **`chore`**    | Changes to the build process or auxiliary tools (e.g., installing a new dependency). |
| **`docs`**     | Documentation-only changes.                                                          |
| **`style`**    | Changes that do not affect the meaning of the code (e.g., formatting, white-space).  |
| **`refactor`** | A code change that neither fixes a bug nor adds a feature.                           |
| **`test`**     | Adding missing tests or correcting existing tests.                                   |

---

### Examples

**A simple feature commit:**

```
feat(auth): add password reset endpoint
```

**A simple fix commit:**

```
fix(map): correct zoom level on initial load
```

**A commit with more detail in the body and a footer:**

```
feat(api): implement rate limiting on login attempts

To enhance security, this change introduces a rate limit of 5
failed login attempts per minute per IP address.

Closes #82
```

**A commit with a breaking change:**

```
refactor(api): rename user ID field from 'uid' to 'userId'

BREAKING CHANGE: The `uid` field in the user object returned from
the `/users/:id` endpoint has been renamed to `userId`. All clients
consuming this endpoint must be updated.
```
