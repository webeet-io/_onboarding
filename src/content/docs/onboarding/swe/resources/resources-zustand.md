---
title: Zustand
sidebar:
  order: 2
description: Starting point in your software engineering journey with webeet.
---

> **Zustand** is a small, fast, and scalable state-management solution for React. It uses a simplified flux-like pattern and leverages hooks, making it feel very intuitive and "React-ish." Its main advantage is its minimalism; it has a tiny footprint and removes the need for boilerplate code often associated with other state management libraries like Redux.
>
> The key to Zustand's simplicity is its `create` function, which builds a custom hook for your application state. This hook can be used in any component to access and update the state without wrapping your entire application in a context provider.

---

### **How to Use Zustand for State Management**

Integrating Zustand is straightforward. You define a "store" containing your state and the functions that can modify it, and then use the hook it generates directly in your components.

#### **1. Creating a Store**

A store is a single object that contains your state variables and action functions. You create it by calling Zustand's `create` function.

```jsx
// store.js
import { create } from "zustand";

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useBearStore;
```

In this example, we define a store with a `bears` count. The `set` function is used to safely update the state. Actions like `increasePopulation` are defined directly within the store.

---

#### **2. Connecting to React Components**

To use the store, you simply import the hook and call it inside your component. It provides access to the entire state object.

```jsx
// BearCounter.jsx
import useBearStore from "./store";

function BearCounter() {
  const bears = useBearStore((state) => state.bears);

  return <h1>{bears} around here ...</h1>;
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation);
  const removeAllBears = useBearStore((state) => state.removeAllBears);

  return (
    <>
      <button onClick={increasePopulation}>one up</button>
      <button onClick={removeAllBears}>remove all</button>
    </>
  );
}
```

Here, we use a selector `(state) => state.bears` to subscribe the component only to changes in the `bears` property. This is a performance optimization that prevents re-renders when other, unused parts of the state change.

---

#### **3. Handling Asynchronous Actions**

Zustand handles asynchronous actions without any extra middleware. You can simply define an `async` function inside your store.

```jsx
// store.js
const usePostStore = create((set) => ({
  posts: [],
  isLoading: false,
  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "[https://api.example.com/posts](https://api.example.com/posts)",
      );
      const posts = await response.json();
      set({ posts, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch posts", error);
      set({ isLoading: false });
    }
  },
}));
```

This example shows how to manage loading states while fetching data from an API, all within the store itself.

---

### **Docs for Further Reading**

- [**Official Zustand Documentation on GitHub**](https://github.com/pmndrs/zustand)
- [**Zustand Official Website**](https://zustand-demo.pmnd.rs/)
- [**Zustand Getting Started**](https://zustand.docs.pmnd.rs/getting-started/introduction)

<!-- end list -->

```

```
