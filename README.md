# FitConnect - Workout Buddy Finder

FitConnect is a modern, mobile-first web application designed to help users find workout partners in their area. It features a dynamic social feed, a swipe-based matching system, and real-time chat to help users connect and coordinate their fitness activities.

This project is a full-stack application built with Next.js (App Router), TypeScript, and Tailwind CSS. The backend is implemented using Next.js API Routes and it's designed to connect seamlessly with a Vercel Postgres database or any other standard Postgres provider.

## Core Features

- **Authentication**: Secure user login and signup flows.
- **Dynamic Feed**: A scrollable feed where users can share workout plans, achievements, and photos. Includes features for upvoting, downvoting, and commenting.
- **Matching System**: A "Find Your Buddy" section with a Tinder-like swipe interface to discover potential workout partners.
- **User Profiles**: Comprehensive profiles displaying a user's bio, reliability score, availability, and a feed of their personal posts. Users can edit their own profile.
- **Real-time Chat**: A messaging system where matched users can communicate.
- **Settings**: A dedicated section for managing account preferences and signing out.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Vercel Postgres (or any standard Postgres provider)
- **Deployment**: Vercel

## Deployment to Vercel

This application is optimized for deployment on [Vercel](https://vercel.com). Follow these steps to go from code to a live, production-ready application.

### Step 1: Push Your Code to a Git Repository

First, ensure all your application code is in a Git repository. Vercel integrates directly with **GitHub**, **GitLab**, and **Bitbucket**.

### Step 2: Import Your Project on Vercel

1.  **Sign Up/Log In**: Go to [vercel.com](https://vercel.com) and create an account or log in.
2.  **Add New Project**: From your Vercel dashboard, click "**Add New...**" and select "**Project**".
3.  **Import Git Repository**: Vercel will show a list of your Git repositories. Find this project and click the "**Import**" button.
4.  **Configure Project**: Vercel will auto-detect that this is a Next.js project. You do not need to change any build settings.

### Step 3: Connect Your Postgres Database

Before deploying, you need to connect a Postgres database. You have two main options:

---

#### Option A: Use Vercel Postgres (Recommended)

1.  **Go to Storage Tab**: In your new Vercel project dashboard, navigate to the "**Storage**" tab.
2.  **Create a Database**: Click "**Create Database**" and select "**Postgres**".
3.  **Connect to Project**: Follow the prompts to connect the new database to your project. Vercel will automatically add the necessary database connection strings (like `POSTGRES_URL`) to your project's Environment Variables.

---

#### Option B: Use a Third-Party Postgres Provider

If you don't have the Vercel Postgres option, you can use any other Postgres provider (e.g., [Supabase](https://supabase.com), [Neon](https://neon.tech), [ElephantSQL](https://www.elephantsql.com/)). They all have generous free tiers.

1.  **Create a Database**: Sign up with a provider and create a new Postgres database project.
2.  **Get the Connection String**: Find the database connection string (often labeled "Postgres URL" or "Connection URI"). Make sure it's the one that pools connections. It will look something like this: `postgres://user:password@host:port/database`.
3.  **Add Environment Variable to Vercel**:
    *   In your Vercel project dashboard, go to the "**Settings**" tab.
    *   Click on "**Environment Variables**".
    *   Add a new variable with the key `POSTGRES_URL`.
    *   Paste your database connection string as the value.
    *   Ensure the variable is available to all environments (Production, Preview, Development).
    *   Click "**Save**".

---

### Step 4: Deploy the Application

After configuring your environment variables (either automatically with Vercel or manually), go to the "**Deployments**" tab and trigger a new deployment to apply the settings.

### Step 5: Seed Your Live Database (Crucial Final Step)

Once the application is deployed, the database will be empty. A special API endpoint has been created to set up all the necessary tables and populate them with initial data.

1.  **Open your live application URL** (e.g., `https-your-project-name.vercel.app`).
2.  In your browser's address bar, add `/api/seed` to the end of the URL and press Enter. It should look like this:
    ```
    https://your-project-name.vercel.app/api/seed
    ```
3.  You should see a success message: `{"message":"Database tables created and seeded successfully."}`

That's it! Your application is now live, connected to a production database, and fully functional. You only need to run the `/api/seed` step **one time**.

## Local Development

To run the application locally, follow these steps:

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Set up Environment Variables**:
    - Create a new file named `.env.local` in the root of the project.
    - Copy the contents from `.env.example` into your new `.env.local` file.
    - You will need a Postgres database connection string. You can get one for free from any provider like [Supabase](https://supabase.com) or use a local Postgres server.
    - Add your connection string to the `.env.local` file:
      ```
      POSTGRES_URL="your_database_connection_string"
      ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

4. **Seed Your Local Database**:
   - With the development server running, open your browser and go to `http://localhost:9002/api/seed`.
   - This will create all the necessary tables in your local database. You only need to do this once.
