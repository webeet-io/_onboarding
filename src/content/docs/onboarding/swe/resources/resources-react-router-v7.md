---
title: React Router v7
description: Overview of React Router v7.
---

> **React Router v7** can be used to handle functionalities traditionally associated with a backend, effectively blurring the lines between client-side and server-side development. This is achieved through its new _"framework mode,"_ which incorporates features from the powerful full-stack framework, **Remix**. While it doesn't replace the need for a dedicated backend in all scenarios, it offers a robust solution for building full-stack React applications with a unified routing system.
>
> The key to React Router v7's backend capabilities lies in its data loading and mutation features, primarily through **`loader`** and **`action`** functions. These functions are defined on your routes and execute on the server, allowing you to fetch data and handle form submissions before your components even render on the client.

---

## How to Use React Router v7 for Backend-like Functionalities

To leverage these features, you'll need to be using React Router in its "framework mode," which is the default when setting up a new project with the Vite plugin for React Router.

#### 1. Data Fetching with `loader` Functions

The **`loader`** function is a server-side function that you can export from your route modules. It's responsible for fetching the data required for that route.

```jsx
// app/routes/posts.jsx
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const response = await fetch(
    "[https://api.example.com/posts](https://api.example.com/posts)",
  );
  const posts = await response.json();
  return { posts };
}

export default function Posts() {
  const { posts } = useLoaderData();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

In this example, before the `Posts` component is rendered, the `loader` function will execute on the server, fetch the posts from an API, and make the data available to the component via the `useLoaderData` hook.

---

#### 2\. Handling Data Mutations with `action` Functions

The **`action`** function is another server-side function that handles data mutations, typically from form submissions. It receives the request object, allowing you to access form data.

```jsx
// app/routes/new-post.jsx
import { redirect, Form } from "react-router-dom";

// This is a placeholder for your actual data creation logic
async function createPost(data) {
  // e.g., await db.posts.create({ data });
  console.log("Creating post:", data);
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");

  await createPost({ title, content });

  return redirect("/posts");
}

export default function NewPost() {
  return (
    <Form method="post">
      <input type="text" name="title" placeholder="Post Title" />
      <textarea name="content" placeholder="Write your post..." />
      <button type="submit">Create Post</button>
    </Form>
  );
}
```

When the form in the `NewPost` component is submitted, the `action` function is invoked on the server. It processes the form data, creates a new post, and then redirects the user to the posts page.

---

### 3\. Server-Side Rendering (SSR)

By default, when using the framework mode, React Router v7 enables **Server-Side Rendering (SSR)**. This means the initial page load is rendered on the server, providing faster perceived performance and better SEO.

---

### Docs for Further Reading

- [**Official React Router Docs**](https://reactrouter.com/home)
- [**Server-Side Rendering with React Router**](https://blog.logrocket.com/server-side-rendering-react-router-v7/#:~:text=Static%20site%20generation%20in%20React,Book%20list) (Blog Post)
- [**Remix's `action` function**](https://remix.run/docs/en/main/route/action)
- [**Remix's `loader` function**](https://remix.run/docs/en/main/route/loader)
- [**What's New in React Router v6.4**](https://www.syncfusion.com/blogs/post/whats-new-react-router-7/amp) (Blog Post)
- [**React Router v7 Tutorial (YouTube)**](https://www.youtube.com/watch?v=h7MTWLv3xvw)

<!-- end list -->

```

```
