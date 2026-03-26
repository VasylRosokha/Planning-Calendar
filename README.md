# Planning Calendar

A React-based planning calendar application for managing orders and their implementation schedules. Built with **React**, **TypeScript**, and **Vite**.

This project is based on the [RTsoft React test assignment](specification.pdf) (original specification in Czech).

## Features

- **Order Management** — Create orders with a name, code, and optional parent order (tree structure with suborders)
- **Calendar View** — Monthly calendar grid displaying all orders with day-level detail
- **Order Terms** — Click any day cell to set a term with start date, end date, and status
- **Time Precision** — Terms support hour-level accuracy for start and end times
- **Status Colors** — Visual color coding by status:
  - Red — New
  - Amber — In Preparation
  - Green — Finished
- **Edit Terms** — Click an existing term block to edit its dates, times, and status
- **Delete Terms** — Hover over a term block and click the cross button to remove it
- **Expand/Collapse** — Parent orders can be collapsed to hide their suborders
- **Month Navigation** — Navigate by month or year with `< >` and `<< >>` controls
- **Today Highlight** — Current day column is visually highlighted
- **Weekend Shading** — Saturday and Sunday columns have a distinct background

## Tech Stack

- React 19
- TypeScript
- Vite

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  components/
    Calendar.tsx    — Main calendar grid (table-based layout)
    Modal.tsx       — Reusable modal wrapper
    OrderModal.tsx  — Form for creating orders
    TermModal.tsx   — Form for creating/editing terms
  utils/
    calendar.ts    — Pure helper functions (date formatting, tree building, etc.)
  types.ts         — Shared TypeScript type definitions
  App.tsx          — Root component with state management
  main.tsx         — Entry point
  index.css        — All styles
```
