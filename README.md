# Joint Purchases

Web application for joint purchases. Users can register, browse categories and products, join group purchases, and track their orders.

## Features

- user registration and authentication;
- browsing categories and products;
- displaying the participant progress for each product;
- joining a group purchase;
- viewing active orders in the profile and dropdown cart;
- cancelling an order;
- editing the user profile;
- storing users, products, and orders in Supabase.

## Technologies

- Vue 3 with `<script setup>`;
- TypeScript;
- Vite;
- Pinia for state management;
- Vue Router for routing and protected pages;
- PrimeVue and PrimeIcons for UI components;
- Tailwind CSS for styling;
- Supabase for authentication and data storage;
- `vue-tsc` for type checking.

## Getting Started

Install the dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Main Routes

- `/auth` — registration and login;
- `/` — category list;
- `/category/:id` — products in the selected category;
- `/profile` — profile and active orders.

Application pages are protected by authentication. Unauthenticated users are redirected to `/auth`.

## Project Structure

- `src/components` — reusable UI and page components;
- `src/stores` — Pinia stores for authentication, users, and products;
- `src/views` — main application pages;
- `src/router` — routes and navigation guards;
- `src/types` — shared TypeScript types;
- `src/utils/supabase.ts` — Supabase client.
