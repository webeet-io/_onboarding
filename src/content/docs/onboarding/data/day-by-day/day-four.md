---
title: Day Four
sidebar:
  order: 4
description: Your journey with webeet starts here!
---

# 🧮 Day 4 – Data Integration & Schema Design

Welcome to Day 4! Today’s task focuses on integrating a new dataset into an existing PostgreSQL database. You’ll take a deeper dive into understanding dataset structure, identifying relevant columns, cleaning messy data, and designing a script-based workflow to load it efficiently.

---

## 🧠 Task Summary

You’ll work with a real-world (and purposefully messy) SAT results dataset. Your goal is to:

- Inspect and understand the structure of the dataset.
- Select meaningful and relational columns that link to existing tables.
- Identify issues in the data such as duplicates, outliers, or formatting inconsistencies.
- Clean and preprocess the data using Python.
- Prepare the data for database insertion.
- Write a Python script that connects to the database and appends the cleaned data.

By completing this task, you’ll practice translating raw CSV data into relational database entries while thinking critically about schema and data integrity.

---

## 📂 Where the Data Lives

You’ll find the dataset in this directory: daily_tasks/day_4/day_4_datasets

---

## ✅ What to Submit

By the end of Day 4, please submit:

- A cleaned version of the dataset as a `.csv` output
- A Python script that:
  - Cleans/preprocesses the raw dataset
  - Appends it to the PostgreSQL database
- A Markdown `.md` file that includes:
  - A brief explanation of your cleaning logic
  - Any challenges you encountered
  - SQL schema or notes about integration strategy (especially if you adjusted table structure)

📌 Save these files in new **day_4_task** folder, not inside the dataset folder.

Then:

- Create a Pull Request with your submission
- Add a comment to the GitHub issue with a link to your PR

---

## 🔗 Related GitHub Issue

Track your task, ask questions, and share your submission here:  
👉 [**Issue #4 – Day 4 Task**](https://github.com/webeet-io/_onboarding_data/issues/6)

---

## ⏳ Note

This task should take approximately 3–4 hours. Focus on clarity and structure. You’re not just cleaning data — you’re designing a sustainable data integration flow.

Make it solid. Make it readable. And have fun! 🛠️🚀
