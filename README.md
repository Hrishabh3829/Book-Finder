# Book Finder

A clean, modern Book Finder built with React, Vite, Tailwind, and shadcn UI. It searches Open Library, lets you browse categories, and save bookmarks.

## Features

- Fast search with a gooey input
- Bookmarks list (your saved books)
- Category browsing (Technology, History, Mystery)
- Filters for cover, author, language, year range
- Responsive card layout and pagination
- Toasts for missing book details

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal.

## Project structure

- src/components - Reusable UI (cards, headers, dropdowns, loaders)
- src/pages - Home, Category, BookDetails, Bookmarks, Author
- src/context - Search and bookmarks state
- src/hooks - Data fetching and filtering

## Notes

- Data source: Open Library API
- Bookmarks are saved in localStorage

## Scripts

- npm run dev - Start the dev server
- npm run build - Production build
- npm run preview - Preview the build
