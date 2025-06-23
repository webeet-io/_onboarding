---
title: Zod
sidebar:
  order: 8
description: Starting point in your software engineering journey with webeet.
---

> **Zod** is a TypeScript-first schema declaration and validation library. Its primary goal is to eliminate the need for redundant type declarations. With Zod, you declare a single schema that serves as the single source of truth for both static TypeScript types and runtime data validation.
>
> The key to Zod's power is its ability to infer a static TypeScript type directly from a validation schema. This means you write your schema once, and Zod ensures your data's structure is correct at runtime while TypeScript ensures your code is type-safe at compile time.

---

### **How to Use Zod for Data Validation**

Zod is incredibly versatile and can be used to validate any data, from form inputs on the frontend to API request bodies on the backend.

#### **1. Defining a Schema**

You start by importing `z` from Zod and defining the shape of your data. Zod provides a wide range of primitive types and utility functions.

```javascript
// schemas.js
import { z } from 'zod';

// Schema for a single user
const UserSchema = z.object({
  username: z.string().min(3, { message: "Username must be 3 or more characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  age: z.number().optional(), // .optional() means it can be undefined
});

// We can infer the TypeScript type directly from the schema
// type User = z.infer<typeof UserSchema>;
/*
type User = {
  username: string;
  email: string;
  age?: number | undefined;
}
*/
````

In this example, we create a `UserSchema` that defines the expected shape of a user object, including validation rules like minimum string length and email format.

-----

#### **2. Parsing and Validating Data**

Once you have a schema, you can use it to validate data. Zod offers two main methods for this: `.parse()` and `.safeParse()`.

  * **`.parse()`**: Throws an error if validation fails. Use this when you expect data to be valid and want any failure to be an exception.
  * **`.safeParse()`**: Returns an object containing either the validated data or an error object. Use this for handling validation failures gracefully without a `try/catch` block.

<!-- end list -->

```javascript
// validation.js
import { UserSchema } from './schemas';

const userData = {
  username: "Tom",
  email: "tom@example.com",
};

// Using .parse()
try {
  const validatedUser = UserSchema.parse(userData);
  console.log("Validation successful:", validatedUser);
} catch (error) {
  // This will catch the ZodError
  console.error("Validation failed:", error.errors);
}

// Using .safeParse()
const result = UserSchema.safeParse(userData);

if (result.success) {
  console.log("Safe validation successful:", result.data);
} else {
  console.error("Safe validation failed:", result.error.format());
}
```

-----

#### **3. Composing Complex Schemas**

Zod excels at creating complex, nested schemas for real-world data structures like API responses.

```javascript
// schemas.js (continued)
const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  author: UserSchema, // Nesting the UserSchema
  tags: z.array(z.string()), // An array of strings
});

// type Post = z.infer<typeof PostSchema>;
```

This example demonstrates nesting the `UserSchema` inside a `PostSchema` and defining an array of strings for `tags`, showcasing how easily schemas can be composed.

-----

### **Docs for Further Reading**

  * [**Zod Hands-on Tutorial**](https://www.totaltypescript.com/tutorials/zod)
  * [**Official Zod Documentation on GitHub**](https://github.com/colinhacks/zod)
  * [**Zod Website & Cheatsheet**](https://zod.dev/)
  * [**Zod with Generics (YouTube)**](https://www.youtube.com/watch?v=9N50YV5NHaE)

<!-- end list -->
