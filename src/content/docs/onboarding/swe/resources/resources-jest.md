---
title: Jest
sidebar:
  order: 5
description: Starting point in your software engineering journey with webeet.
---

> **Jest** is a popular, zero-configuration testing framework for JavaScript, developed by Meta. Its goal is to make the testing process simple and intuitive. Jest comes with everything you need out of the box: a test runner, an assertion library (`expect`), and powerful mocking capabilities. This "batteries-included" approach means you can start writing meaningful tests quickly without complex setup.
>
> For our stack, Jest is essential for ensuring both our **Fastify** backend and our **React** frontend are reliable and bug-free. You'll use it to verify that API endpoints return the correct data, utility functions behave as expected, and React components render correctly under different conditions.

---

### **How to Use Jest for Testing**

Jest tests are typically organized into `describe` blocks, which group related tests. Each individual test case is defined within an `it` or `test` block.

#### **1. The Basic Test Structure**

At its core, a Jest test makes an assertion about your code. You use the `expect` function with a "matcher" function (like `.toBe()`) to check if a value is what you expect it _to be_.

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}

// sum.test.js
import { sum } from "./sum";

describe("sum function", () => {
  it("should add two numbers correctly", () => {
    // Expect the result of sum(1, 2) to be 3
    expect(sum(1, 2)).toBe(3);
  });

  it("should handle negative numbers", () => {
    expect(sum(-1, -1)).toBe(-2);
  });
});
```

When you run Jest, it will automatically find and execute files ending in `.test.js` and report whether the expectations passed or failed.

---

#### **2. Testing Fastify Endpoints**

Jest is perfect for writing integration tests for your Fastify API. You don't need to run a live server; instead, you can use Fastify's built-in `inject` method to simulate HTTP requests and test your route handlers directly.

```javascript
// server.js
import Fastify from "fastify";

export function buildApp() {
  const app = Fastify();
  app.get("/", async (request, reply) => {
    return { hello: "world" };
  });
  app.post("/users", async (request, reply) => {
    // In a real app, you'd save the user to a database
    reply.code(201);
    return { user: request.body };
  });
  return app;
}

// server.test.js
import { buildApp } from "./server";

describe("Fastify Server Routes", () => {
  let app;

  beforeAll(async () => {
    app = buildApp();
    await app.ready(); // Ensure all plugins are loaded
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 OK on the root route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ hello: "world" });
  });

  it("should create a user and return 201 on POST /users", async () => {
    const newUser = { name: "Tom", email: "tom@example.com" };
    const response = await app.inject({
      method: "POST",
      url: "/users",
      payload: newUser,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual({ user: newUser });
  });
});
```

This example shows how to test both a `GET` and a `POST` endpoint, checking the status codes and the JSON responses to ensure the API works correctly.

---

#### **3. Mocking Functions**

Mocking allows you to replace parts of your code (like a database call or an external API) with a "fake" version. This lets you test a piece of code in isolation.

```javascript
// api.js
export async function fetchUserData(userId) {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  return await response.json();
}


// user.test.js
import { fetchUserData } from './api';

// Create a mock function
const mockFetch = jest.fn();

// Replace the global fetch with our mock
global.fetch = mockFetch;

it('should call the fetch API with the correct URL', async () => {
    mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ name: 'Mock User' })
    });

    await fetchUserData(123);

    // Assert that our mock fetch was called with the expected URL
    expect(mockFetch).toHaveBeenCalledWith('[https://api.example.com/users/123](https://api.example.com/users/123)');

```

---

### **Docs for Further Reading**

- [**Official Jest Website**](https://jestjs.io/)
- [**Jest Docs: Getting Started**](https://jestjs.io/docs/getting-started)
- [**Jest Docs: Mock Functions**](https://jestjs.io/docs/mock-function-api)

<!-- end list -->
