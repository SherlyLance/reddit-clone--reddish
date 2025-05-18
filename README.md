# Reddit Clone

**Built with Next.js 15 · Sanity · Clerk · OpenAI · Tailwind**

An AI-powered Reddit clone with real-time updates, community features, and smart content moderation.

---

## ⚙️ Features

### 👤 Users

* Browse all posts
* Search posts & communities
* Create, edit, and delete posts
* Vote & comment
* Upload images
* View user profiles

### 🌐 Communities

* Create & manage subreddits
* Community-specific feeds
* Report posts/comments

### 🤖 AI-Powered

* Auto content moderation
* Inappropriate content detection
* User reporting system
* OpenAI-based filtering

### 🚀 Tech Stack

* **Next.js 15** – App Router + Server Actions
* **Sanity CMS** – Headless content management
* **Clerk** – Authentication & user profiles
* **Tailwind + Radix UI** – Clean, accessible UI
* **Turbopack** – Fast dev experience
* **Fully responsive** & mobile-friendly
* **Built-in theme switcher**

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/reddit-ai-clone
cd reddit-ai-clone

# 2. Install
pnpm install

# 3. Dev server
pnpm dev
---

## 🧪 Setup

### 🔐 .env.local

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# OpenAI
OPENAI_API_KEY=...
---


## 🔐 Clerk

* Create a Clerk app
* Set redirect URLs
* Paste keys into `.env.local`

---

## 💻 Built With

* 🧩 Next.js 15
* 🧠 OpenAI API
* 🧾 Sanity CMS
* 🔐 Clerk Auth
* 🎨 Tailwind CSS + Radix UI
* 🌙 Theme support

---
