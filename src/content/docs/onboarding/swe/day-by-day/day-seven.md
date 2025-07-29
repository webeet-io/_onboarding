---
title: Day Seven
sidebar:
  order: 7
description: Creating posts with image uploads, styling, and Vercel deployment.
---

## Empowering Users: Create Posts with Images & Go Live!

Welcome to Day Seven! Today is a big day. We're going to implement the ability for users to create new posts, including **uploading images**, a core feature of any Instagram-like application. This involves handling file uploads on the backend and building a robust form on the frontend. We'll also refine our application's visual appeal with some styling, and finally, we'll deploy our application to Vercel, making it accessible to the world!

---

### Backend Milestones (Repo 1: `insta-clone-fastify-backend`)

Our backend needs to be able to receive image files, save them, and store their paths in the database.

#### 1. File Upload Setup

We'll use `fastify-multipart` to handle file uploads.

- [ ] **Install `fastify-multipart`**

  ```bash
  npm install @fastify/multipart
  npm install --save-dev @types/busboy
  ```

- [ ] **Configure and register the multipart plugin in `server.ts`**
      Add the following to your `server.ts` file, before any routes that will use it.

  ```typescript title="src/server.ts (Updated)"
  // ... (existing imports)
  import multipart from "@fastify/multipart";
  import path from "path";
  import fs from "fs/promises";
  import { randomUUID } from "crypto";

  const fastify = Fastify({
    logger: true,
  });

  // Register multipart plugin
  fastify.register(multipart);

  // ... (existing registrations like databasePlugin, postsRoutes, reelsRoutes, etc.)
  ```

#### 2. Image Storage Service

Let's create a dedicated service for handling image storage.

- [ ] **Create an image storage directory**

  ```bash
  mkdir -p public/uploads
  ```

- [ ] **Create `src/common/file-storage.service.ts`**
      This service will handle saving the uploaded files to our `public/uploads` directory.

  ```typescript title="src/common/file-storage.service.ts"
  import path from "path";
  import fs from "fs/promises";
  import { randomUUID } from "crypto";

  export const fileStorageService = {
    async saveImage(
      fileBuffer: Buffer,
      originalFilename: string,
    ): Promise<string> {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists

      const fileExtension = path.extname(originalFilename);
      const uniqueFilename = `${randomUUID()}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      await fs.writeFile(filePath, fileBuffer);

      // Return the public URL path
      return `/uploads/${uniqueFilename}`;
    },
  };
  ```

#### 3. Update Posts Module for Image Uploads

Now we need to modify our existing posts module to accept an image.

- [ ] **Update `posts.service.ts`**
      Modify the `create` method to accept an optional file buffer and filename, then use the `fileStorageService`.

  ```typescript title="src/modules/posts/posts.service.ts (Updated)"
  import type { FastifyInstance } from "fastify";
  import { fileStorageService } from "../../common/file-storage.service"; // Import the new service

  type CreatePostData = {
    img_url: string; // This will now come from our storage service
    caption: string;
  };

  type CreatePostServiceArgs = {
    caption: string;
    imageFile?: { buffer: Buffer; filename: string }; // New optional image file
  };

  export const postsService = (fastify: FastifyInstance) => {
    return {
      create: async (data: CreatePostServiceArgs) => {
        fastify.log.info(`Creating a new post`);

        let img_url = data.caption; // Fallback if no image, or placeholder

        if (data.imageFile) {
          // If an image is provided, save it and get the URL
          img_url = await fileStorageService.saveImage(
            data.imageFile.buffer,
            data.imageFile.filename,
          );
        }

        const post = fastify.transactions.posts.create({
          img_url,
          caption: data.caption,
        });
        return post;
      },
    };
  };
  ```

- [ ] **Update `posts.routes.ts`**
      Modify the `POST /posts` route to handle `multipart/form-data` and extract the image file.

  ```typescript title="src/modules/posts/posts.routes.ts (Updated)"
  import type { FastifyInstance, FastifyPluginAsync } from "fastify";
  import { postsService } from "./posts.service";
  import { z } from "zod"; // Import Zod for validation

  // Define a Zod schema for the expected form fields
  const createPostSchema = z.object({
    caption: z.string().min(1, "Caption cannot be empty.").optional(),
    // The image will be handled as a file stream/buffer, not directly in the JSON body.
    // So, we don't define it here for Zod's parsing of the JSON body,
    // but rather access it from the multipart request.
  });

  const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    const service = postsService(fastify);

    fastify.post("/posts", async (request, reply) => {
      // Ensure the request is multipart
      if (!request.isMultipart()) {
        reply.code(415).send({ message: "Request must be multipart" });
        return;
      }

      const parts = request.parts(); // Get the multipart parts

      let caption: string | undefined;
      let imageFile: { buffer: Buffer; filename: string } | undefined;

      for await (const part of parts) {
        if (part.type === "field") {
          if (part.fieldname === "caption") {
            caption = part.value as string;
          }
        } else if (part.type === "file") {
          // Read the file stream into a buffer
          const buffers: Buffer[] = [];
          for await (const chunk of part.file) {
            buffers.push(chunk);
          }
          imageFile = {
            buffer: Buffer.concat(buffers),
            filename: part.filename,
          };
        }
      }

      // Basic validation (can be enhanced with Zod for fields if not using streams)
      if (!imageFile && !caption) {
        return reply
          .code(400)
          .send({ message: "Either image or caption is required." });
      }

      try {
        // We can still validate the caption if it exists
        if (caption) {
          createPostSchema.pick({ caption: true }).parse({ caption });
        }

        const newPost = await service.create({
          caption: caption || "", // Pass empty string if no caption, or adjust logic
          imageFile: imageFile,
        });

        return reply.code(201).send(newPost);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply
            .code(400)
            .send({ message: "Validation failed", errors: error.errors });
        }
        fastify.log.error(error);
        return reply.code(500).send({ message: "Failed to create post" });
      }
    });

    // ... (existing GET /posts route and any other routes)
  };

  export { postsRoutes };
  ```

#### 4. Verification with Postman/Curl

- [ ] **Start your backend server (`npm run dev`)**.
- [ ] **Test with Postman or Curl:**
      You need to send a `multipart/form-data` request.
  - **Method:** `POST`
  - **URL:** `http://localhost:3000/posts`
  - **Body:** Select `form-data`
    - Add a `key`: `caption`, `Type`: `Text`, `Value`: `My awesome new image!`
    - Add a `key`: `file`, `Type`: `File`, `Value`: Choose an image file from your computer.

  You should receive a `201 Created` response with the new post object, including the `img_url` pointing to your local `public/uploads` directory. Verify the image file is actually saved in `public/uploads`.

---

### Frontend Milestones (Repo 2: `insta-clone-react-frontend`) ✅

We'll build a dedicated page for creating new posts, complete with a file input and a submission action.

#### 1. Create Post Schema (Client-Side Validation)

- [ ] **Update `app/schemas/post.schema.ts`**
      Add a schema for the creation payload.

  ```typescript title="app/schemas/post.schema.ts (Updated)"
  import { z } from "zod";

  // ... (existing postSchema and postsSchema)

  // Schema for creating a new post (for frontend validation)
  export const createPostInputSchema = z
    .object({
      caption: z.string().min(1, "Caption is required.").max(255).optional(),
      image: z.instanceof(File).optional(), // For file input
    })
    .refine((data) => data.caption || data.image, {
      message: "Either an image or a caption is required.",
      path: ["image"], // Attach error to image field if both are missing
    });

  export type CreatePostInput = z.infer<typeof createPostInputSchema>;
  ```

#### 2. Create Post Form Component

- [ ] **Create `app/components/CreatePostForm.tsx`**

  ```tsx title="app/components/CreatePostForm.tsx"
  import React, { useState } from "react";
  import { Form, useNavigation } from "react-router";
  import { createPostInputSchema } from "~/schemas/post.schema";
  import { z } from "zod";

  type FormErrors = z.ZodIssue[];

  export function CreatePostForm() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<FormErrors>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setImageFile(null);
        setPreviewUrl(null);
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrors([]); // Clear previous errors

      // Client-side validation
      const validationResult = createPostInputSchema.safeParse({
        caption,
        image: imageFile || undefined,
      });

      if (!validationResult.success) {
        setErrors(validationResult.error.issues);
        return;
      }

      // If validation passes, proceed with form submission
      const formData = new FormData();
      if (caption) formData.append("caption", caption);
      if (imageFile) formData.append("file", imageFile); // 'file' matches backend expected field name

      // Programmatically submit the form data using useNavigation's form ref
      // (Alternatively, use a ref on the Form component if more complex logic is needed before submission)
      (event.target as HTMLFormElement).submit();
    };

    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create New Post</h2>
        <Form
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Image Preview"
                className="mt-4 max-h-60 w-auto rounded-md shadow-sm mx-auto"
              />
            )}
            {errors.find((e) => e.path[0] === "image") && (
              <p className="mt-2 text-sm text-red-600">
                {errors.find((e) => e.path[0] === "image")?.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Write a caption..."
            ></textarea>
            {errors.find((e) => e.path[0] === "caption") && (
              <p className="mt-2 text-sm text-red-600">
                {errors.find((e) => e.path[0] === "caption")?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </Form>
      </div>
    );
  }
  ```

#### 3. Create Post Route with Action

- [ ] **Create `app/routes/create.tsx`** (This will be a top-level route, accessible from the bottom navigation).

  ```tsx title="app/routes/create.tsx"
  import { ActionFunctionArgs, redirect } from "react-router";
  import { CreatePostForm } from "~/components/CreatePostForm";
  import { api } from "~/services/api";
  import { createPostInputSchema } from "~/schemas/post.schema";
  import { z } from "zod";

  export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const caption = formData.get("caption")?.toString();
    const imageFile = formData.get("image") as File;

    // Client-side validation against Zod schema
    const validationResult = createPostInputSchema.safeParse({
      caption,
      image: imageFile,
    });

    if (!validationResult.success) {
      // You might want to return errors to the form, e.g., via `json`
      // For simplicity, we'll just log and redirect for now.
      console.error(
        "Client-side validation failed:",
        validationResult.error.issues,
      );
      return redirect("/create"); // Redirect back to the form
    }

    const payload = new FormData();
    if (validationResult.data.caption) {
      payload.append("caption", validationResult.data.caption);
    }
    if (validationResult.data.image) {
      payload.append("file", validationResult.data.image); // 'file' is the field name backend expects
    }

    try {
      await api.post("/posts", payload, {
        headers: {
          "Content-Type": "multipart/form-data", // Crucial for file uploads
        },
      });
      return redirect("/profile/posts/grid"); // Redirect to posts grid after successful creation
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle API errors (e.g., show a toast message)
      return { success: false, error: "Failed to create post." };
    }
  }

  export default function CreatePostPage() {
    return (
      <div className="py-8">
        <CreatePostForm />
      </div>
    );
  }
  ```

#### 4. Link in Bottom Navigation

- [ ] **Update `app/components/BottomNav.tsx`**
      Change the `➕` icon to link to the new `/create` route.

  ```tsx title="app/components/BottomNav.tsx (Updated)"
  import { Link } from "react-router";

  export function BottomNav() {
    return (
      <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
          <Link
            to="/home"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            🏠
          </Link>
          <div className="inline-flex flex-col items-center justify-center px-5">
            🔍
          </div>
          <Link
            to="/create" {/* Changed to /create */}
            className="inline-flex flex-col items-center justify-center px-5"
          >
            ➕
          </Link>
          <Link
            to="/"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            Reels
          </Link>
          <Link
            to="/profile"
            className="inline-flex flex-col items-center justify-center px-5"
          >
            👤
          </Link>
        </div>
      </footer>
    );
  }
  ```

---

### Styling and Polish ✅

Now, let's enhance the visual appeal of our application using Tailwind CSS. We've already got it set up!

- [ ] **Review `app/app.css` and `tailwind.config.js`**
      Ensure your `tailwind.config.js` is correctly configured to scan your `app` directory for classes.
      `app/app.css` should typically contain only `@tailwind` directives.

- [ ] **Add Basic Global Styles (if not already present)**
      Ensure your `app/app.css` includes:

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

- [ ] **Apply Tailwind Classes to Existing Components**
      Go through your `Header.tsx`, `BottomNav.tsx`, `PostCard.tsx`, `ProfileLayout.tsx`, `ReelGridItem.tsx`, and the new `CreatePostForm.tsx`.
  - Use utility classes for padding (`p-`), margin (`m-`), flexbox (`flex`, `justify-`, `items-`), borders (`border`), shadows (`shadow-`), rounded corners (`rounded-`), colors (`bg-`, `text-`), etc.
  - Aim for a clean, mobile-first design that resembles Instagram's aesthetic.

  _(Self-directed task: This is where you apply your CSS skills! Refer to Tailwind CSS documentation as needed.)_

---

### Deployment to Vercel ✅

Making your application publicly available is the final step. Vercel provides an excellent free tier for hosting.

#### 1. Prepare Backend for Deployment

- **Environmental Variables:** If your backend connects to a database or other external services, ensure connection strings or API keys are handled via environment variables (e.g., using `process.env.DATABASE_URL`). For SQLite, remember it's a file-based database. For production, you'd typically use a persistent, cloud-hosted database like PostgreSQL or a managed SQLite service if available. For this project, a simple re-creation on deploy might suffice for demonstration, or consider a dedicated database hosting.
- **Build Script:** Ensure your `package.json` has a `build` script that compiles your TypeScript to JavaScript (e.g., `tsc`).
- **Start Script:** Ensure your `package.json` has a `start` script that runs the compiled application (e.g., `node build/server.js`).

#### 2. Deploy Frontend to Vercel

Vercel is optimized for React projects.

- [ ] **Create a Vercel Account:** If you don't have one, sign up at [vercel.com](https://vercel.com/).
- [ ] **Connect Git Repository:**
  1.  Go to your Vercel dashboard.
  2.  Click "Add New..." -> "Project".
  3.  Select "Import Git Repository" and choose your frontend project's repository (e.g., `insta-clone-react-frontend`).
  4.  Vercel will usually auto-detect a React project and configure it correctly. Confirm the framework (Vite), build command (`npm run build`), and output directory (`dist`).
  5.  Click "Deploy".
- [ ] **Set Environment Variables (if any):** If your frontend needs to know the backend URL (e.g., for `axios.baseURL`), you'll need to set an environment variable in Vercel.
  1.  After deployment, go to your project settings in Vercel.
  2.  Navigate to "Environment Variables".
  3.  Add `VITE_API_BASE_URL` (or similar) with your deployed backend URL.

#### 3. Deploy Backend to Vercel (or another suitable platform)

Deploying a Fastify backend to Vercel can be done, but Vercel is primarily optimized for serverless functions and frontend applications. For a persistent Node.js server like our Fastify app, other platforms like Render, Railway, or even a basic VPS might be more straightforward for a continuous running server.

**Option A (Vercel Serverless - Advanced):**
You can adapt your Fastify app to run as a Vercel Serverless Function. This requires some changes, typically by wrapping your Fastify instance within a Vercel `api` route. This is more advanced for an intern project but possible. You'd move your `server.ts` logic into `api/index.ts` (or similar).

**Option B (Separate Hosting - Recommended for beginners with a full backend):**

1.  **Choose a Platform:** Render.com, Railway.app, or Heroku (free tier limitations) are good choices for Node.js backends.
2.  **Connect Git Repository:** Similar to Vercel, connect your backend Git repository.
3.  **Configure Build & Start Commands:** Ensure the platform runs `npm install`, then `npm run build`, and finally `npm run start` or `node build/server.js`.
4.  **Database Consideration:** For SQLite, the database file won't persist across deploys or scale well in a serverless/containerized environment. For a production-ready app, you'd migrate to a cloud-hosted relational database (e.g., PostgreSQL on ElephantSQL, Supabase, Render Postgres, etc.). For this project, you might have to accept that the database resets on each deploy if you stick with SQLite on a non-persistent file system.
5.  **Set Environment Variables:** Configure any necessary environment variables for your backend (e.g., `PORT`, `DATABASE_URL` if you switch to a persistent DB).

- [ ] **Decide on a Backend Hosting Strategy:** Discuss with your mentor/team the best approach for deploying the Fastify backend given the project's scope and persistence needs. Implement the chosen strategy.
- [ ] **Obtain Backend URL:** Once deployed, get the public URL of your backend.
- [ ] **Update Frontend Environment Variable:** Go back to your Vercel frontend project settings and update the `VITE_API_BASE_URL` to point to your _deployed backend URL_. Redeploy your frontend to pick up this change.

---

### Verification

1.  **Open your deployed frontend URL (from Vercel).**
2.  **Verify existing features:** Navigate through your profile, posts, and reels. Ensure data loads correctly from your _deployed backend_.
3.  **Create a New Post:**
    - Click the `➕` icon in the bottom navigation.
    - Fill out the caption and upload an image.
    - Submit the form.
    - You should be redirected to your posts grid, and your newly created post should appear! (Note: If your backend's SQLite database resets on deploy, you might only see new posts and not old seeded data).

---

### Conclusions

You've just built a complete full-stack feature, from frontend form submission with file uploads to backend file storage and database updates. Then, you took your application live! This is a massive leap in building real-world applications.

**Key Takeaways:**

1.  **File Uploads (`multipart/form-data`):** You learned how to handle files on both the frontend (using `FormData` and `File` objects) and backend (using `fastify-multipart` to parse streams).
2.  **Server-Side File Storage:** Saving uploaded files to a public directory allows you to serve them directly via HTTP. In a larger application, you'd often use cloud storage services like AWS S3 or Google Cloud Storage.
3.  **Client-Side Validation (Zod):** Performing validation on the frontend with Zod provides immediate feedback to users and reduces unnecessary network requests.
4.  **React Router `action`:** You effectively used an `action` function to handle form submissions and perform mutations (creating a new post) directly within your route, providing a powerful data flow pattern.
5.  **Full-Stack Development Cycle:** You iterated on both the frontend and backend to deliver a complete feature.
6.  **Deployment:** Taking your application from local development to a public URL is a crucial skill. You now understand the basic steps involved in deploying a modern web application.

You are now well-equipped to tackle complex full-stack features and bring your applications to life for users.
