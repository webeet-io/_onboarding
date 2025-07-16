---
title: FastAPI
sidebar:
  order: 10
description: Building high-performance, AI-powered APIs with Python.
---

> **FastAPI** is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints. It's designed to be intuitive, easy to use, and to help developers build production-ready APIs quickly. FastAPI leverages Pydantic for data validation and serialization, and automatically generates interactive API documentation (Swagger UI and ReDoc).
>
> At Webeet, FastAPI is our go-to framework for developing the robust and efficient backend services that power our **AI-first neighborhood and apartment search website**, including our prompt-generation service.

---

### **Why FastAPI for our Backend?**

FastAPI offers several compelling advantages that align perfectly with our development philosophy and stack:

- **High Performance**: It's one of the fastest Python web frameworks available, often comparable to Node.js frameworks like Fastify (which you're using for our main app backend) in benchmarks.
- **Developer Experience**: FastAPI's reliance on Python type hints provides excellent editor support, auto-completion, and data validation, reducing bugs and speeding up development.
- **Automatic Docs**: It automatically generates interactive API documentation (Swagger UI and ReDoc) directly from your code, which is invaluable for team collaboration and integration. [cite_start]You have prior experience with Swagger for API documentation[cite: 217, 218, 241, 243].
- **Asynchronous Support**: Built with `async/await` support from the ground up, it's ideal for handling concurrent requests and long-running AI model inferences efficiently.
- **Type Safety with Pydantic**: Pydantic, which FastAPI uses, allows you to define data schemas with Python type hints. This provides automatic request validation and response serialization, catching errors early. [cite_start]This ties into your Masterschool learning on data validation and sanitization[cite: 143, 215, 238].

---

### **Core Concepts of FastAPI**

#### 1. Defining Routes and HTTP Methods

Just like Fastify and other web frameworks, FastAPI uses decorators to define API endpoints and the HTTP methods they respond to (`GET`, `POST`, `PUT`, `DELETE`).

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/items/")
async def create_item(item: dict): # Item will be validated by Pydantic
    return {"item": item, "status": "created"}
```
