# 🚀 DailyRank Actions: Elevate Your Daily Routines!

[![GitHub build status](https://github.com/Tatz21/daily-rank-actions/actions/workflows/main.yml/badge.svg)](https://github.com/Tatz21/daily-rank-actions/actions/workflows/main.yml)
[![GitHub language count](https://img.shields.io/github/languages/count/Tatz21/daily-rank-actions)](https://github.com/Tatz21/daily-rank-actions)
[![GitHub top language](https://img.shields.io/github/languages/top/Tatz21/daily-rank-actions)](https://github.com/Tatz21/daily-rank-actions)
[![GitHub last commit](https://img.shields.io/github/last-commit/Tatz21/daily-rank-actions)](https://github.com/Tatz21/daily-rank-actions/commits/main)
[![GitHub contributors](https://img.shields.io/github/contributors/Tatz21/daily-rank-actions)](https://github.com/Tatz21/daily-rank-actions/graphs/contributors)
[![Project version](https://img.shields.io/github/package-json/v/Tatz21/daily-rank-actions)](https://github.com/Tatz21/daily-rank-actions/blob/main/package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

DailyRank Actions is an ambitious project aimed at creating a robust and user-friendly platform for tracking, ranking, and managing daily activities and routines. Whether you're trying to build better habits, compete with friends, or simply organize your day more effectively, DailyRank Actions provides the tools you need. Built with a modern tech stack focused on performance and developer experience, this repository provides the frontend application, powered by Vite and React, with a strong emphasis on component reusability using Radix UI and styling with Tailwind CSS.

## ✨ Key Features

*   **📈 Daily Activity Tracking:** Effortlessly log and monitor your daily tasks and achievements.
*   **🏆 Ranking System:** See how your daily actions measure up against personal goals or community leaderboards.
*   **🧩 Modular UI Components:** Leverages Radix UI for accessible and customizable UI primitives.
*   **🎨 Responsive & Stylable:** Designed with Tailwind CSS for a highly customizable and responsive user interface.
*   **🔐 Secure Authentication:** Integrated with `@lovable.dev/cloud-auth-js` for robust user authentication.
*   **🚀 Fast Development Experience:** Built with Vite for lightning-fast HMR and bundling.
*   **🧪 Comprehensive Testing:** Includes Vitest for unit and integration testing.

## 🛠️ Tech Stack

<p align="left">
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a>
  <a href="https://react.dev/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a>
  <a href="https://vitejs.dev/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/vitest-dev/vitest/main/docs/public/logo.svg" alt="vite" width="40" height="40"/> </a>
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="tailwind CSS" width="40" height="40"/> </a>
  <a href="https://radix-ui.com/" target="_blank" rel="noreferrer"> <img src="https://user-images.githubusercontent.com/35939217/173977508-6a58cdcd-5d6d-49da-954f-5606d8601c77.png" alt="Radix UI" width="40" height="40"/> </a>
  <a href="https://supabase.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/supabase/supabase-original.svg" alt="supabase" width="40" height="40"/> </a>
  <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js" width="40" height="40"/> </a>
  <a href="https://bun.sh/" target="_blank" rel="noreferrer"> <img src="https://bun.sh/logo.svg" alt="Bun" width="40" height="40"/> </a>
</p>

*   **Frontend Framework:** [React](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/)
*   **Form Management:** [@hookform/resolvers](https://react-hook-form.com/get-started/#SchemaValidation)
*   **Authentication:** [@lovable.dev/cloud-auth-js](https://lovable.dev/)
*   **Backend/Database (Potential):** [Supabase](https://supabase.com/) (indicated by file structure)
*   **Package Manager:** [npm](https://www.npmjs.com/) / [bun](https://bun.sh/)
*   **Testing:** [Vitest](https://vitest.dev/)
*   **Code Linting:** [ESLint](https://eslint.org/)
*   **Code Formatting:** [Prettier](https://prettier.io/) (implied by config)

## 🚀 Installation

To get this project up and running on your local machine, follow these steps.

### Prerequisites

Make sure you have Node.js and a package manager (npm or Bun) installed:

*   [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
*   [npm](https://www.npmjs.com/get-npm) (usually comes with Node.js) OR [Bun](https://bun.sh/docs/installation)

### 1. Clone the Repository

First, clone the `daily-rank-actions` repository to your local machine:

```bash
git clone https://github.com/Tatz21/daily-rank-actions.git
cd daily-rank-actions
```

### 2. Install Dependencies

You can use either npm or Bun to install the project dependencies.

#### Using npm:

```bash
npm install
```

#### Using Bun:

```bash
bun install
```

### 3. Environment Variables

Create a `.env` file in the root of the project by copying `example.env` (if provided, otherwise create an empty `.env` and fill it based on your Supabase and authentication setup). This file will contain sensitive information such as API keys and Supabase credentials.

```bash
cp .env.example .env # If .env.example exists
# Otherwise, create .env and add your variables
```

An example `.env` file might look like this (adjust according to actual requirements from `@lovable.dev/cloud-auth-js` and Supabase):

```env
# Supabase Configuration (if applicable)
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# @lovable.dev/cloud-auth-js Configuration
VITE_AUTH_CLIENT_ID="YOUR_AUTH_CLIENT_ID"
VITE_AUTH_REDIRECT_URI="http://localhost:5173/auth/callback"
# Add any other environment variables required by your application
```

### 4. Run the Development Server

Start the development server.

#### Using npm:

```bash
npm run dev
```

#### Using Bun:

```bash
bun run dev
```

The application should now be running on `http://localhost:5173` (or another port if 5173 is in use).

### 5. Build for Production

To create a production-ready build:

#### Using npm:

```bash
npm run build
```

#### Using Bun:

```bash
bun run build
```

The compiled assets will be placed in the `dist` directory.

## 💡 Usage

Once the development server is running, navigate to `http://localhost:5173` in your web browser.

The `daily-rank-actions` application will present an interface for managing daily activities. Depending on the current stage of development, you will typically interact with the application through:

*   **Authentication Forms:** Sign up or log in using the `@lovable.dev/cloud-auth-js` integration.
*   **Activity Dashboards:** View, add, edit, or delete your daily tasks.
*   **Ranking Displays:** See how your activities contribute to your rank or score.
*   **Component Interactions:** Experiment with the various Radix UI components integrated into the application.

Here's an example of how you might use a component like a `Dialog` or `Button` within the application's React structure:

```tsx
// src/components/CreateActivityDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button'; // Assuming a custom button component
import { Input } from './ui/input'; // Assuming a custom input component

interface CreateActivityDialogProps {
  onActivityCreated: (activityName: string) => void;
}

export function CreateActivityDialog({ onActivityCreated }: CreateActivityDialogProps) {
  const [activityName, setActivityName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (activityName.trim()) {
      onActivityCreated(activityName);
      setActivityName('');
      setOpen(false); // Close the dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Daily Activity</DialogTitle>
          <DialogDescription>
            What new habit or task do you want to track today?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="activity-name"
            placeholder="e.g., Read for 30 minutes"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />
        </div>
        <Button type="submit" onClick={handleSubmit}>Save Activity</Button>
      </DialogContent>
    </Dialog>
  );
}

// In another component (e.g., an activity list page):
// import { CreateActivityDialog } from '../components/CreateActivityDialog';
//
// const handleNewActivity = (name: string) => {
//   console.log('New activity created:', name);
//   // Here, you would typically make an API call to save the activity
//   // and then update the local state or refetch activities.
// };
//
// <CreateActivityDialog onActivityCreated={handleNewActivity} />
```

This project heavily utilizes Radix UI primitives, which are then styled with Tailwind CSS to create custom components (often found in a `src/components/ui/` directory, inferred from `components.json`). Explore the `src` directory to understand how these components are composed to build the application's UI.

## 📂 Project Structure

```
daily-rank-actions/
├── public/                 # Static assets (images, favicon, etc.)
├── src/                    # Source code of the application
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable React components
│   │   └── ui/             # Radix-UI based styled components (e.g., button, dialog)
│   ├── lib/                # Utility functions, helpers, hooks
│   ├── pages/              # Top-level page components (e.g., HomePage, DashboardPage)
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point for the React application
│   └── index.css           # Global styles or Tailwind directives
├── supabase/               # Supabase-related configurations or functions
├── .env                    # Environment variables (local config)
├── .gitignore              # Files/directories ignored by Git
├── index.html              # Main HTML entry file
├── package.json            # Project dependencies and scripts (npm)
├── bun.lockb               # Bun lockfile
├── bun.lock                # Bun lockfile
├── package-lock.json       # npm lockfile
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # TypeScript config for application files
├── tsconfig.node.json      # TypeScript config for Node.js specific files (e.g., vite.config.ts)
├── vite.config.ts          # Vite build configuration
├── vitest.config.ts        # Vitest testing configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration (used by Tailwind)
├── eslint.config.js        # ESLint configuration
├── components.json         # Configuration for shadcn/ui or similar component setup
└── README.md               # You are here!
```

## 🤝 Contributing

We welcome contributions to DailyRank Actions! If you're interested in improving the project, please follow these guidelines:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/issue-description`.
3.  **Make your changes.** Ensure your code adheres to the project's coding style (ESLint and Prettier are configured to help with this).
4.  **Write tests** for your changes, if applicable.
5.  **Run tests** to ensure everything passes: `npm run test` or `bun run test`.
6.  **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new activity tracking feature"`
7.  **Push your branch** to your forked repository: `git push origin feature/your-feature-name`
8.  **Open a Pull Request** against the `main` branch of this repository. Provide a detailed description of your changes.

### Code Style

This project uses ESLint and Prettier for code linting and formatting. Please run the lint and format scripts before committing.

```bash
# Lint and fix issues
npm run lint -- --fix
# or
bun run lint -- --fix

# Format code
npm run format
# or
bun run format
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
