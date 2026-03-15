# iBuildApps

A modern, fast, and fully-featured community-driven platform for discovering, discussing, and launching new products daily—inspired by Product Hunt. 

Built with the latest modern web stack including Next.js App Router, React 19, Tailwind CSS v4, and Drizzle ORM.

## 🚀 Features

### For Users & Makers
*   **Discover & Explore:** Browse trending and recently launched products via the beautifully designed Explore page.
*   **Product Submissions:** A seamless flow for makers to submit their own projects, complete with taglines, descriptions, and metadata.
*   **Upvoting System:** Engaged users can upvote their favorite tools to push them up the daily leaderboards.
*   **Authentication & Profiles:** Secure authentication handled by Clerk, including Organization switching and profile management directly from the navigation bar.
*   **Modern Aesthetics:** Designed with a meticulously crafted `oklch` color scheme, transparent "glass" cards, and smooth micro-animations.

### For Administrators
*   **Comprehensive Admin Dashboard:** A protected `/admin` route exclusively accessible to users with the `isAdmin` metadata flag.
*   **Approval Workflow:** Review incoming product submissions. Admins can effortlessly **Approve** or **Reject** products.
*   **Detailed Analytics:** View live statistics including Total Products, Active Users, Total Votes, and Pending/Approved/Rejected counts.
*   **Product Management:** Toggle products as "Featured" (pushing them above the 100-vote threshold), delete inappropriate submissions, and monitor recent platform activity via a synced activity feed.

## 🛠 Tech Stack

**Core Frameworks**
*   [Next.js](https://nextjs.org/) (App Router, Server Actions, Server Components)
*   [React 19](https://react.dev/)

**Styling & UI Components**
*   [Tailwind CSS v4](https://tailwindcss.com/) (using advanced `@theme inline` variables)
*   [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
*   [Lucide React](https://lucide.dev/) (Beautiful, consistent icons)
*   [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)
*   [tw-animate-css](https://github.com/DesignToCode/tw-animate-css) (Micro-interactions)

**Backend & Database**
*   [Drizzle ORM](https://orm.drizzle.team/) (Type-safe SQL ORM)
*   [Neon Database](https://neon.tech/) (Serverless Postgres)

**Authentication**
*   [Clerk](https://clerk.com/) (Complete user management and auth)

## 📂 Project Structure

```text
├── app/
│   ├── admin/           # Secured Admin dashboard and server actions
│   ├── explore/         # Product discovery page
│   ├── how-it-works/    # Modular explainer page 
│   ├── products/        # Dynamic individual product pages
│   ├── submit/          # Authenticated product submission flow
│   ├── globals.css      # Core Tailwind v4 configuration + OKLCH variables
│   └── layout.tsx       # Root layout containing ClerkProvider
├── components/
│   ├── admin/           # Admin-specific UI (Stats cards, Data tables, Pending activity)
│   ├── auth/            # Clerk custom UserButton integration
│   ├── common/          # Reusable UI (Header, Empty States, UI primitives)
│   ├── how-it-works/    # Modular sections (Hero, Step-by-Step, FAQs, CTA)
│   ├── landing-page/    # Home page specific modular components
│   └── products/        # Product display cards, grids, and vote buttons
├── db/
│   └── schema.ts        # Drizzle database schema definitions
└── lib/                 # Utility functions, formatters, and centralized queries
```

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js installed, as well as accounts with [Clerk](https://clerk.com/) and [Neon](https://neon.tech/) to grab your environment variables.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup your environment variables. Create a `.env.local` file in the root directory:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Neon Database
   DATABASE_URL=your_neon_postgres_connection_string
   ```

4. Push the database schema to your Neon Postgres database:
   ```bash
   npx drizzle-kit push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛡 Enabling Admin Features

By default, new users do not have admin access. To grant yourself access to the `/admin` dashboard:
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com).
2. Navigate to **Users** and click on your profile.
3. Scroll down to **Public Metadata**.
4. Add the following JSON snippet and save:
   ```json
   {
     "isAdmin": true
   }
   ```
5. Log out and log back in, or refresh your session. The "Admin Dashboard" option will now appear when clicking your profile picture on the website.

## 🤝 Contributing
Contributions, issues and feature requests are welcome! Feel free to check the issues page.

---
*Powered by Next.js, Clerk, Drizzle, and Tailwind CSS v4.*
