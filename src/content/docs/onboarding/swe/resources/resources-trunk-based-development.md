---
title: Trunk Based Development
sidebar:
  order: 4
description: Our philosophy and workflow for continuous integration and rapid delivery.
---

At Webeet, we use **Trunk Based Development (TBD)** as our core development strategy for the Layered project. This approach is designed to keep our codebase simple, our integration process smooth, and our delivery cycles fast. This document explains what TBD is, why we use it, and how it applies to your daily work.

---

### What is Trunk Based Development?

Trunk Based Development is a branching model where all developers work on a single, central branch called the "trunk." For our project, the trunk is the `development` branch.

Instead of creating large, long-lived feature branches that are worked on for weeks or months, developers create very small, short-lived branches from the trunk, complete a small piece of work, and merge it back into the trunk very quickly, **often within the same day**.

The key principle is that the **trunk (`development`) must always be in a stable, releasable state.**

### How Does It Work in Practice?

Our workflow is a direct implementation of Trunk Based Development:

1.  **The Trunk is `development`**: This is our single source of truth. All new work starts from here, and all completed work is merged back here.
2.  **The Intermediary `feat` Branches**: These are shorter-lived than development, and are meant to collect all the work done towards one Feature.
3.  **Short-Lived Branches**: Your `_feat/` task branches are the "short-lived branches" in our TBD model. Each one represents a small-scoped change as part of a big Feature.
4.  **Frequent Merges**: Your goal is to get your task branch merged into its parent feature branch, and ultimately into `development`, as quickly as possible. This process of merging small pieces of code frequently is the heart of **Continuous Integration**.

This avoids the large, complex, and painful "merge hell" that happens when developers work in isolation on separate branches for long periods.

### Why Do We Use Trunk Based Development?

Adopting this model brings several significant advantages that are crucial for a fast-moving project like Layered:

- **Simplified Branching**: We avoid complex branch management strategies. There is only the trunk and your small, temporary working branch.
- **Continuous Integration and Faster Feedback**: Because code is merged back to the trunk so frequently, it is continuously integrated and tested. This means we catch bugs and integration issues almost immediately, not weeks later.
- **Eliminates Merge Conflicts**: By integrating in small, carefully-scoped batches, we drastically reduce the chances of large, difficult-to-solve merge conflicts.
- **Enables Continuous Delivery**: Since the `development` trunk is always stable, we are always in a position to deploy our code. This allows us to release new features and fixes to users much faster.

### What Does This Require?

Trunk Based Development is powerful, but it relies on a strong foundation of automation and discipline:

- **Comprehensive Automated Testing**: Since we merge to the trunk constantly, we must have a suite of automated tests (unit, integration, and end-to-end) to ensure that no change breaks the codebase. A merge to `development` should never leave it in a broken state.
- **Robust CI/CD Pipeline**: Our Continuous Integration/Continuous Deployment pipeline automatically runs all tests on every commit and pull request, acting as the gatekeeper for the trunk.

---

### Further Reading

To learn more about the principles and benefits of this practice, we highly recommend reading the following resource from the DORA (DevOps Research and Assessment) team at Google:

- [**DORA: Trunk Based Development**](https://dora.dev/capabilities/trunk-based-development/)
