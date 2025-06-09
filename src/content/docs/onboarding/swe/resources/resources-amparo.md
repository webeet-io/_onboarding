---
title: Amparo
sidebar:
  order: 7
description: Starting point in your software engineering journey with webeet.
---

`amparo-fastify` is a utility library designed to streamline error handling in Fastify applications. It helps replace verbose `try...catch` blocks and manual error responses with a set of concise, declarative functions. The core goal is to produce standardized, structured error responses throughout the API.

---

## Core Concepts

### `ErrorName`

The `ErrorName` enum is a fundamental part of the library. It provides a standardized set of names for different error types. These names are used to classify errors and likely map directly to specific HTTP status codes within the Fastify framework.

- **`ErrorName.badRequest`**: For client-side errors, like invalid input (HTTP 400).
- **`ErrorName.authentication`**: For issues related to user identity or permissions (HTTP 401/403).
- **`ErrorName.internalServerError`**: For unexpected server-side failures (HTTP 500).

---

## Key Functions

The library's power comes from a few key assertion and wrapper functions.

### 1. `safe`

**Purpose**: Wraps a `Promise` to handle potential rejections without a `try...catch` block.

- **How it Works**: If the promise resolves, `safe` returns the resolved value. If the promise rejects for any reason, `safe` catches the error and throws a new, structured application error using the provided message and `ErrorName`.
- **Use Case**: Ideal for any asynchronous operation that might fail, such as database queries or external API calls.

**Example from code**:
`safe` wraps a database call to ensure that if the query fails, a standard `InternalServerError` is thrown.

```typescript
// Wraps the database query promise
const dbResponse = await safe(
  getOneByFieldAppDb<UserEntity>(/* ... */),
  // This message and error are used ONLY if the promise rejects
  "Failed to fetch user from db",
  ErrorName.internalServerError,
);
```

### 2. assert

Purpose: Ensures a value is "truthy" (i.e., not null, undefined, false, 0, or ""). If it's not, it throws a specified error.

- **How it Works**: If the provided value is truthy, the function returns the value. If it's falsy, it immediately throws a structured error.
- **Use Case**: Perfect for general-purpose checks where you expect a value to exist or a condition to be true after an operation.

Example from code:
assert checks if isPasswordValid is true. If false, it throws an Authentication error.

```typescript
// Checks if isPasswordValid is true
assert(
  isPasswordValid,
  // This message and error are used if isPasswordValid is false
  "Invalid email or password",
  ErrorName.authentication,
);
```

### 3. assertWithTypeguard

Purpose: Validates that a value conforms to a specific TypeScript type or shape using a type guard function.

- **How it Works**: If the type guard returns true, assertWithTypeguard returns the original value, now correctly typed. If the guard returns false, it throws a structured error.
- **Use Case**: The primary tool for validating the shape of incoming data, like request.body.

Example from code:
This function uses a Zod schema to validate the request body.

```typescript
const signInRequestPayload = assertWithTypeguard(
  request.body,
  // The type guard returns true if the body matches the Zod schema.
  (value): value is SignInDto => SignInBodyDtoSchema.safeParse(value).success,
  "Body shape does not conform with requirements",
  ErrorName.badRequest,
);
```

## Advanced Patterns: Type-Safe Authenticated Controllers

amparo-fastify also enables architectural patterns for creating type-safe controllers that require user authentication. This is achieved by combining a controller builder with Fastify's module augmentation feature.

### 1. Fastify Module Augmentation

Purpose: To add custom, fully-typed properties to Fastify's native FastifyRequest object.

- **Why it's needed:** In a typical auth flow, a preHandler hook verifies a user's token and attaches the user's data to the request object. Module augmentation tells TypeScript that properties like _user will exist on certain requests, preventing type errors.
- **Implementation:** A *.ts file is created to declare module "fastify" and extend the FastifyRequest interface.

Example from code:
This code adds optional \_user and \_workspace properties to every Fastify request.

```typescript
declare module "fastify" {
  // Defines the shape of the user object
  type RequestUser = {
    id: string;
    email: string;
    username: string;
    // ... more fields
  };

  // Extends the global FastifyRequest interface
  interface FastifyRequest {
    _user?: RequestUser;
    _workspace?: RequestCurrentWorkspace;
  }
}
```

### 2. The Controller Builder Pattern

Purpose: To abstract away repetitive boilerplate from controller definitions, enforce conventions, and improve type safety.

- **baseControllerBuilder:** amparo-fastify provides a generic baseControllerBuilder. It takes the core logic of a controller (a BaseControllerHelper) and handles the routine tasks of executing it and sending the response.
- **authControllerBuilder:** This is a specialized wrapper around the baseControllerBuilder. Its specific job is to create controllers that are guaranteed to have an authenticated user. It pre-configures the baseControllerBuilder to use an AuthRequest type, which ensures request._user exists and is fully typed.

Example from code:
This builder creates a convention: any controller that needs an authenticated user should be built with authControllerBuilder.

```typescript
// The custom builder takes the controller's core logic
const authControllerBuilder = <T extends AuthRequestVariant>(
    controllerHelper: BaseControllerHelper<T, AuthRequest<T>>
) =>
    // It calls the generic builder, but specifically uses the AuthRequest type,
    // which enforces that request._user is present.
    baseControllerBuilder<T, AuthRequest<T>>(controllerHelper);
```
