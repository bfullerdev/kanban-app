# Kanban App

A modern, interactive Kanban board application built with React, TypeScript, and Tailwind CSS. Manage multiple projects with smooth drag-and-drop task organization, subtask tracking, and persistent local storage. Features a sleek, responsive UI with sidebar navigation and real-time state updates.

## Features

- **Multi-Board Management**: Switch between different boards (e.g., "Platform Launch", "Marketing Plan") easily.
- **Drag and Drop**: Move tasks between columns (To Do, In Progress, Done) using a smooth `@dnd-kit` powered interface.
- **Task Details**: Create and edit tasks with full descriptions and nested subtasks.
- **Persistence**: Automatically saves your boards and active selections to the browser's `localStorage`.
- **Responsive Design**: A clean, mobile-friendly interface styled with Tailwind CSS.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: `@dnd-kit`
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Icons**: Lucide React

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: (v18.0.0 or later recommended) - [Download fromnodejs.org](https://nodejs.org/)
- **npm**: Comes bundled with Node.js

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd kanban-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running Locally

To start the development server, run:
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or the port specified in your terminal).

### Testing

To run the test suite, use:
```bash
npm run test
```

## Project Structure

- `src/components`: Reusable UI components (Sidebar, Column, TaskCard, etc.)
- `src/hooks`: Custom React hooks, including `useBoardData` for state management.
- `src/types`: TypeScript definitions for the application.
- `src/__mocks__`: Mock data for testing environments.
