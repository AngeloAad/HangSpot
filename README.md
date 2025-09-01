# Hangspot

Welcome to Hangspot! This is a social application designed to help people discover, create, and join local events and hangouts. It's a place to find cool things to do and meet people with similar interests.

## What is Hangspot?

Imagine you're looking for something fun to do this weekend, like a hiking trip, a book club meeting, or a casual get-together in a park. Hangspot is the platform where you can find these events, which we call "Experiences."

- **Discover:** Browse a list or a map of experiences happening near you.
- **Create:** Have an idea for a hangout? Create your own experience and invite others to join.
- **Connect:** Join experiences, leave comments, and connect with other users.

It's all about bringing people together through shared activities and real-world connections.

## Core Features

- **User Authentication:** Secure sign-up and login for users.
- **Create & Manage Experiences:** Users can create, update, and delete their own events.
- **Interactive Map View:** Experiences are displayed on a map, making it easy to see what's happening nearby.
- **Social Interactions:** Attend, favorite, and comment on experiences.
- **User Profiles:** View other users' profiles and the experiences they've created or are attending.
- **Search & Filtering:** Easily find experiences that match your interests.
- **Notifications:** Get notified about interactions with your experiences.

## Tech Stack

Hangspot is built with a modern, type-safe technology stack, organized as a monorepo.

### Frontend

- **Framework:** [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **UI Components:** [Tailwind CSS](https://tailwindcss.com/) for styling, with accessible components from [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/).
- **Data Fetching & State:** [TanStack Query](https://tanstack.com/query) (formerly React Query) for managing server state.
- **Mapping:** [Leaflet](https://leafletjs.com/) for the interactive map.

### Backend

- **Runtime:** [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **API Layer:** [tRPC](https://trpc.io/) for creating fully type-safe APIs, ensuring seamless and error-free communication between the frontend and backend.
- **Database:** [SQLite](https://www.sqlite.org/index.html)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries and schema management.
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) for secure user sessions.

### Architecture

- **Monorepo:** The project is managed as a `pnpm workspace`, which keeps the `client`, `server`, and `shared` codebases in one repository for better organization and code sharing.

## Getting Started

Follow these instructions to get a local copy of Hangspot up and running on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later is recommended)
- [pnpm](https://pnpm.io/installation) package manager

### Installation

1.  **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd hangspot
    ```

2.  **Install dependencies:**
    From the root of the project, run:
    ```sh
    pnpm install
    ```
    This will install all the necessary packages for the client, server, and shared workspaces.

### Running the Development Servers

You'll need to run both the backend server and the frontend client in separate terminals.

1.  **Start the backend server:**

    ```sh
    pnpm --filter @advanced-react/server dev
    ```

    The server will start, and you should see a message indicating it's running. It will also watch for file changes and automatically restart.

2.  **Start the frontend client:**
    In a new terminal:
    ```sh
    pnpm --filter @advanced-react/client dev
    ```
    The client development server will start, and you can now open your browser and navigate to the provided local URL (usually `http://localhost:5173`) to see the application.

## Project Structure

The monorepo is organized into three main packages:

- `client/`: Contains the React frontend application.
- `server/`: Contains the Node.js, Express, and tRPC backend.
- `shared/`: Contains shared code, such as validation schemas (`zod`), that is used by both the client and server.
