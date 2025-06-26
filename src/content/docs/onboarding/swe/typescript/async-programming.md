---
title: Async Model
sidebar:
  order: 2
description: Handling Asynchronous Operations with Promises and Async/Await.
---

> Asynchronous programming is a cornerstone of modern web development, allowing you to perform tasks like fetching data from an API, reading a file, or waiting for a timer without blocking the main thread of your application. TypeScript fully supports modern asynchronous JavaScript patterns and enhances them with its powerful type system.
>
> Understanding how to work with `Promises` and the `async/await` syntax is crucial for building responsive and efficient applications. TypeScript ensures that the data you work with in these asynchronous contexts is type-safe, preventing common bugs related to unexpected data shapes from APIs.

---

### **How to Handle Asynchronous Operations**

To understand how JavaScript and TypeScript can handle async tasks without stopping the entire program, you first need to know about the Event Loop.

#### **1. The Event Loop: The 'How' of Async**

JavaScript is a single-threaded language, meaning it can only do one thing at a time. So, how does it handle long-running operations like API calls without freezing? The answer is the **Event Loop**.

The Event Loop's job is to orchestrate asynchronous tasks. When you start an async operation (like `fetch` or `setTimeout`), it's handed off to the browser or Node.js to handle in the background. Once that task is finished, it places a callback function in a queue. The Event Loop constantly checks if the main thread (the "call stack") is empty. If it is, the loop takes the first item from the queue and pushes it onto the stack to be executed.

This model allows JavaScript to be non-blocking, ensuring a smooth user experience. For a fantastic explanation, we highly recommend watching this talk:

- [**What the heck is the event loop anyway?** by Philip Roberts](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

---

#### **2. Understanding Promises**

A `Promise` is an object that represents the eventual completion (or failure) of an asynchronous operation. It can be in one of three states: pending, fulfilled, or rejected. TypeScript allows you to define the type of value a `Promise` will resolve with.

```typescript
// A function that returns a Promise resolving to a string
function fetchData(): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful API call
      resolve("Data fetched successfully!");

      // To see the error case, uncomment the line below
      // reject("Failed to fetch data.");
    }, 1000);
  });
}

// Using the Promise
fetchData()
  .then((message) => {
    // 'message' is correctly inferred as type 'string'
    console.log(message.toUpperCase());
  })
  .catch((error) => {
    // 'error' is of type 'any' by default, but we know it's a string here
    console.error(error);
  });
```

By specifying `Promise<string>`, you declare that a successful resolution of `fetchData` will always yield a string.

---

#### **3. Simplifying with `async/await`**

The `async/await` syntax is modern syntactic sugar built on top of Promises, making asynchronous code look and feel more like synchronous code. This is the preferred way to handle async operations in our stack.

An `async` function always returns a `Promise`. The `await` keyword pauses the execution of the `async` function until the `Promise` is settled (either resolved or rejected).

```typescript
// Let's define a shape for our user data
interface User {
  id: number;
  name: string;
  email: string;
}

// This async function fetches a user from a fake API
async function getUser(userId: number): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user.");
  }

  const user: User = await response.json();
  return user;
}

// We must call an async function from within another async context
async function main() {
  try {
    const user = await getUser(1);
    // 'user' is correctly typed as 'User'
    console.log(`Fetched user: ${user.name}`);
    // console.log(user.username); // Error! Property 'username' does not exist on type 'User'.
  } catch (error) {
    console.error(error.message);
  }
}

main();
```

Here, `async/await` provides a clear, linear way to write asynchronous logic, and the `try...catch` block offers a standard way to handle errors from awaited promises.

---

#### **4. Simplified Error Handling with `safe`**

While `try...catch` is effective, it can be verbose if you need to handle errors for many individual `await` calls. In our stack, we use a custom utility function called `safe` from the `amparo-fastify` library to streamline this.

The `safe` function wraps a Promise. If the Promise resolves, it returns the value. If the Promise rejects, `safe` automatically catches the error and throws a new, more specific error with a custom message. This helps us avoid writing repetitive `try...catch` blocks for single operations.

```typescript
import { safe, ErrorName } from "amparo-fastify";

// Assume 'request' is a Fastify request object inside a route handler
async function handleRequest(request) {
  // If request.formData() rejects, 'safe' will
  // catch the error and throw an InternalServerError
  // with our custom message.
  const formData = await safe(
    request.formData(), // The promise to execute
    "No form data found in auth loader", // The custom error message
    ErrorName.internalServerError, // The type of error to throw
  );

  // If the code reaches here, formData is guaranteed to be valid.
  // The value is also correctly typed.
  const email = formData.get("email");

  // ... continue processing
}
```

This pattern makes our code cleaner and ensures consistent error handling across the application. Any errors thrown by `safe` can be caught by a centralized Fastify error hook.

---

#### **5. Typing Asynchronous React Components**

When building React components that fetch their own data, you combine TypeScript's component typing with `async/await`. The modern approach is to define the component's props with an interface and type the function's arguments directly.

```tsx
// UserDisplay.tsx
import React, { useState, useEffect } from "react";

// Define the shape for the data we will fetch
interface User {
  id: number;
  name: string;
}

// Define the shape for the component's props
interface UserDisplayProps {
  userId: number;
}

// This async function could be in an external API service file
async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  if (!response.ok) throw new Error("User not found");
  return response.json();
}

const UserDisplay = ({ userId }: UserDisplayProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const fetchedUser = await fetchUser(userId);
        setUser(fetchedUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId]); // Re-run effect if userId changes

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Welcome, {user?.name}</div>;
};
```

This example shows a full data-fetching lifecycle within a React component, with type-safe state management for the user data, loading status, and potential errors.

---

### **Docs for Further Reading**

- [**MDN Docs on Async/Await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [**MDN Docs on Promises**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [**TypeScript Handbook on Async/Await**](https://www.typescriptlang.org/docs/handbook/release-notes/es2017.html#async-functions)
- [**Total TypeScript - Async/Await Tutorial**](https://www.totaltypescript.com/tutorials/beginners-typescript/async-await)
