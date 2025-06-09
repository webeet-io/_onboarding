---
title: Fastify
sidebar:
  order: 4
description: High-Speed, Low-Overhead Backend Development.
---

> **Fastify** is a modern, high-performance web framework for Node.js. It is designed to be one of the fastest Node.js frameworks available, focusing on providing the best possible developer experience with the lowest overhead. Its powerful plugin architecture and declarative approach to features like validation make it an excellent choice for building robust and efficient APIs.
>
> The key to Fastify's performance and developer experience lies in its design principles: it uses a schema-based approach to optimize routes and serialize JSON, and its hook and plugin system allows for extreme flexibility and code reuse.

---

### **How to Use Fastify for Building APIs**

Getting started with Fastify is straightforward. It encourages a structured approach to building your server, from defining routes to validating data.

#### **1. Creating a Basic Server**

A Fastify server is simple to initialize. You import the library, create an instance, define a route, and start listening for connections.

```javascript
// server.js
import Fastify from "fastify";

const fastify = Fastify({
  logger: true, // Enables built-in logging
});

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
```

In this example, a simple `GET` route on `/` is created, which automatically serializes the returned JavaScript object into a JSON response.

---

#### **2. Schema-Based Validation**

One of Fastify's most powerful features is built-in data validation using JSON Schema. This allows you to validate incoming request bodies, headers, parameters, and querystrings declaratively. This is often done using a helper library like `zod-to-json-schema` to work with Zod schemas, which you will learn more about later.

```javascript
// server.js (continued)
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1. Define your Zod schema
const postSchema = z.object({
  title: z.string(),
  content: z.string().min(10),
});

// 2. Define the route with the validation schema
fastify.post(
  "/posts",
  {
    schema: {
      body: zodToJsonSchema(postSchema), // Validate the request body
    },
  },
  async (request, reply) => {
    // request.body is guaranteed to be valid according to the schema
    const { title, content } = request.body;

    // Logic to create a new post...
    // const newPost = await createPost({ title, content });

    reply.code(201); // Set HTTP status code for "Created"
    return { success: true, title };
  },
);
```

If a request is made to `POST /posts` with a body that doesn't match the `postSchema`, Fastify will automatically send back a `400 Bad Request` response with details about the validation errors, without your route handler ever running.

---

### **Docs for Further Reading**

- [**Official Fastify Website**](https://www.fastify.io/)
- [**Fastify Documentation - Getting Started**](https://fastify.dev/docs/latest/Guides/Getting-Started/)
- [**Routes and Validation Explained**](https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/)

<!-- end list -->
