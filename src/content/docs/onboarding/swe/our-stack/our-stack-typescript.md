---
title: TypeScript
sidebar:
  order: 1
description: Overview of TypeScript.
---

> **TypeScript** is a powerful, open-source language developed by Microsoft that builds on top of JavaScript. Simply put, it is **JavaScript, plus a type system**. It doesn't replace JavaScript; instead, it extends it. All valid JavaScript code is also valid TypeScript code, but TypeScript adds features that help you write more robust, understandable, and maintainable applications.
>
> The main benefit of TypeScript is **static type checking**. It catches errors and bugs in your editor _before_ you even run your code, which can save you from countless runtime errors. If you know JavaScript, you already know 95% of TypeScript. The rest is learning how to describe the "shapes" of your data.

---

### **How to Use TypeScript**

The transition from JavaScript to TypeScript involves gradually adding type annotations to your code to make it more explicit and predictable.

#### **1. Basic Type Annotations**

In JavaScript, a variable can change its type. In TypeScript, you can explicitly declare the type of a variable, and the compiler will ensure it never holds a different type of value.

```typescript
// javascript.js
let name = "Alice";
name = 123; // This is valid in JS, but could cause bugs

// typescript.ts
let name: string = "Alice";
// name = 123; // Error! Type 'number' is not assignable to type 'string'.

// TypeScript can also infer types
let age = 30; // TypeScript knows 'age' is a number without you writing ': number'
// age = "thirty"; // Error!
```

By adding `: string`, you tell TypeScript that the `name` variable should always be a string, catching potential errors early.

---

#### **2. Defining Complex Shapes with `interface` and `type`**

The real power of TypeScript shines when you describe the shape of your objects. You can do this using an `interface` or a `type` alias.

```typescript
// schemas.ts
// Using an interface to describe an object's shape
interface User {
  id: number;
  username: string;
  isPremium?: boolean; // The '?' makes this property optional
}

// Using a type alias
type Post = {
  title: string;
  content: string;
  author: User; // We can use our User interface here!
};

function displayUser(user: User) {
  console.log(`Welcome, ${user.username}`);
  // console.log(user.email); // Error! Property 'email' does not exist on type 'User'.
}

const myUser: User = { id: 1, username: "Tom" };
displayUser(myUser);
```

Here, `User` and `Post` act as blueprints for your data. TypeScript will ensure that any object you declare as a `User` has the correct properties, preventing common errors like typos or accessing non-existent properties.

---

#### **3. Typing React Components and Props**

TypeScript is incredibly useful in React for defining the props a component should receive. This makes your components more predictable and easier to use.

```tsx
// UserProfile.tsx
import React from "react";

// Define the shape of the props object for this component
interface UserProfileProps {
  username: string;
  posts: number;
  isLoggedIn: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  posts,
  isLoggedIn,
}) => {
  if (!isLoggedIn) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h1>{username}</h1>
      <p>Posts: {posts}</p>
    </div>
  );
};

// Now, when you use this component, TypeScript will enforce the props.
// <UserProfile username="Alice" posts={15} isLoggedIn={true} />  // OK
// <UserProfile username="Bob" posts="twenty" />                   // Error! 'posts' should be a number.
// <UserProfile username="Charlie" isLoggedIn={true} />            // Error! 'posts' prop is missing.
```

---

### **Docs for Further Reading**

- [**TypeScript Interactive Tutorial**](https://www.totaltypescript.com/tutorials/beginners-typescript)
- [**Official TypeScript Website**](https://www.typescriptlang.org/)
- [**TypeScript for JavaScript Programmers**](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) (Official Handbook)
- [**TypeScript for New Programmers**](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) (Official guide for beginners)
- [**TypeScript Playground**](https://www.typescriptlang.org/play) (Write TS and see the compiled JS live)
