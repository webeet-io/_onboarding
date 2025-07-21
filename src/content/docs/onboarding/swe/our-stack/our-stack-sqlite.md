---
title: SQLite
sidebar:
  order: 6
description: Starting point in your software engineering journey with webeet.
---

> **SQLite** is a unique C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine. Unlike most other SQL databases, SQLite does not have a separate server process. Instead, it reads and writes directly to ordinary disk files. A complete SQL database with multiple tables, indices, triggers, and views, is contained in a single disk file.
>
> For our stack, **SQLite** is an excellent choice for local development and prototyping within our application. Its simplicity and file-based nature mean there's no complex setup required, allowing you to have a fully functional SQL database up and running in minutes. It's perfect for building and testing features before deploying to a larger production database system.

---

### **How to Use SQLite in a Node.js Project**

Integrating SQLite into a Node.js application is typically done using a driver library. A popular and efficient choice is `better-sqlite3`, which provides a simple, synchronous API.

#### **1. Setup and Basic Operations**

First, you install the library and create a database file. All operations are performed by creating a `Database` instance.

```javascript
// db-setup.js
import Database from "better-sqlite3";

// This will create 'blog.db' if it doesn't exist.
const db = new Database("blog.db");

// Create a table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Database initialized successfully.");
```

You can run this script once to set up your database schema.

---

#### **2. Integrating SQLite with Fastify**

The best way to use SQLite with Fastify is to establish a connection when the server starts and make it available to your route handlers. Decorating the Fastify instance is a clean way to achieve this.

```javascript
// server.js
import Fastify from "fastify";
import Database from "better-sqlite3";

const app = Fastify({ logger: true });

// 1. Connect to the database
const db = new Database("blog.db");

// 2. Decorate the Fastify instance with the database connection
app.decorate("db", db);

// 3. Define routes that use the database
app.get("/posts", async (request, reply) => {
  // Access the db via the decorated instance
  const stmt = app.db.prepare("SELECT * FROM posts ORDER BY createdAt DESC");
  const posts = stmt.all();
  return posts;
});

app.post("/posts", async (request, reply) => {
  const { title, content } = request.body;

  // Use prepared statements to prevent SQL injection
  const stmt = app.db.prepare(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
  );
  const info = stmt.run(title, content);

  reply.code(201);
  return { id: info.lastInsertRowid, title, content };
});

// Start the server
const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

In this example:

1.  We connect to `blog.db`.
2.  `app.decorate('db', db)` makes the database instance available inside every route handler via `app.db` (or `request.server.db`).
3.  The `/posts` routes prepare and run SQL queries to read from and write to the database. Using prepared statements (`?` placeholders) is a crucial security practice.

---

### **Why this works well with our stack:**

- **Fastify:** The single connection instance is efficiently reused across all requests without the overhead of reconnecting.
- **Jest:** During testing, you can use an in-memory SQLite database (`new Database(':memory:')`) to ensure tests are fast and don't affect your development database file.
- **Development Speed:** It provides the power of SQL without the setup complexity of a larger database server like PostgreSQL or MySQL, making it ideal for the initial phases of the onboarding project.

---

### **Docs for Further Reading**

- [**Official SQLite Website**](https://www.sqlite.org/)
- [**When To Use SQLite**](https://www.sqlite.org/whentouse.html) (Important to understand its use cases)
- [**`better-sqlite3` Documentation on GitHub**](https://github.com/WiseLibs/better-sqlite3)
- [**Using a Database with Fastify**](https://www.fastify.io/docs/latest/Guides/Database/) (Official Guide)
