# 50 Questions About iBuildApps

A comprehensive FAQ covering everything users need to know about the iBuildApps platform — from submitting products and engaging with the community to the underlying tech stack and automation capabilities.

---

## Section 1: General Services

**1. What is iBuildApps?**
iBuildApps is a Product Hunt-style community platform where creators can share apps, AI tools, SaaS products, and creative projects. It focuses on authentic launches, real builders, and genuine peer feedback — connecting makers directly with early adopters and enthusiasts.

**2. Who is iBuildApps for?**
iBuildApps is built for founders, indie makers, and developers who want to showcase what they've built and gather real community feedback. It's equally useful for tech enthusiasts, early adopters, and anyone who loves discovering new products before they go mainstream.

**3. Do I need an account to browse products?**
No — the homepage, Explore page, and individual product pages are fully public. You only need a registered account to submit a product, upvote, or leave a review.

**4. How do I create an account?**
Click the sign-in button in the top-right header and follow the Clerk-powered authentication flow. You can register with your email address; a verified email is required before you can vote or engage.

**5. What does it mean for a product to be "Featured"?**
A product earns a "Featured" badge automatically once it reaches more than 100 upvotes. Featured products are highlighted in product cards across the platform to increase their visibility.

**6. How do I submit my product?**
Navigate to `/submit` (the "Share Your Project" button on the homepage) and fill in the form: product name, URL slug, tagline, description, website URL, and tags. Your submission enters a `pending` queue and is reviewed by the admin team before it goes live.

**7. What information is required to submit a product?**
The submission form requires six fields: a product name (3–120 characters), a unique URL slug (lowercase, numbers, hyphens only), a tagline (up to 200 characters), a description (10–1,000 characters), a valid website URL, and at least one comma-separated tag (e.g., `AI, SaaS, Productivity`).

**8. Do I need to be part of an organization to submit?**
Yes — the current submission action requires you to be a member of a Clerk organization. If your account is not linked to an organization, the submission will be blocked with an appropriate error message.

**9. How long does it take for my product to be approved?**
The moderation team reviews each submission to check for spam, duplicates, and quality. This typically takes between 1 and 12 hours depending on the volume of pending submissions.

**10. What happens after my product is approved?**
Once approved, your product becomes publicly visible on the homepage and Explore page. The `status` field transitions from `pending` to `approved`, and an `approvedAt` timestamp is recorded in the database.

**11. Can my product be rejected?**
Yes. If a submission violates quality guidelines — such as spam, duplicate entries, or incomplete information — an admin can reject it. The status will change to `rejected` in the database.

**12. Can I edit my product after it is submitted?**
Yes, certain fields like your tagline, description, and tags can be updated. However, the product URL slug cannot be changed once voting has begun, to maintain link integrity and fairness in rankings.

**13. How does upvoting work?**
Click the upvote button on any product card or detail page. Each user can cast one upvote per product; clicking again toggles the vote off (removes it). You must have a verified email address to vote, and there is a rate limit of 10 vote toggles per minute.

**14. Can I downvote a product I haven't upvoted?**
No. The "downvote" action on the platform only removes an existing upvote — it does not allow negative voting. You must have already upvoted a product before you can undo that vote.

**15. How are products ranked on the homepage?**
Products are ranked primarily by their `voteCount`. The homepage shows two curated sections: "Featured Products" (highest vote counts) and "Recently Launched Products." Early votes in the product's lifetime also carry slightly more weight in the overall ranking algorithm.

**16. How does the Explore page work?**
The Explore page (`/explore`) lists all approved products and provides a live search bar and two sort modes — "Trending" (sorted by vote count, highest first) and "Recent" (sorted by creation date, newest first). Results are paginated at 6 products per page.

**17. How does search work on the Explore page?**
The search runs entirely client-side and filters products by matching your query against the product name, tagline, description, and tags. Switching sort mode or clearing the search automatically resets you to page 1.

**18. What types of products can I submit?**
The platform welcomes apps, AI tools, SaaS products, browser extensions, open-source projects, and creative digital projects. Tags like `AI`, `SaaS`, `Productivity`, `Developer Tools`, and `Design` are common examples.

**19. How do I leave a review or comment on a product?**
Open any product detail page and scroll to the "Reviews & Comments" section. You must be signed in to submit a review. Top-level reviews can include a 1–5 star rating and text up to 2,000 characters.

**20. Can I reply to someone else's review?**
Yes. Each top-level review has a "Reply" option. Replies support up to two levels of nesting — you can reply to a top-level review, but you cannot reply to a reply (no third-level threads).

**21. Can replies include a star rating?**
No. Star ratings (1–5) are only available on top-level reviews. Replies are text-only to keep nested discussions focused.

**22. Can I edit or delete my review?**
Yes. You can edit or delete your own reviews at any time. Admins also have the ability to delete any review on the platform for moderation purposes. Deleting a parent review also removes all its replies.

**23. What is the @mention feature?**
While writing a comment or reply, type `@` followed by at least two characters to trigger a live autocomplete dropdown. The system searches registered users by name and lets you tag them directly. The mentioned user receives a notification with a direct link to your comment.

**24. Will I get notified when someone mentions me?**
Yes. A notification is automatically created in your inbox (`/notifications`) whenever another user mentions you in a comment. Notifications include the mentioner's name and a direct link to the relevant review.

**25. How do notifications work?**
The bell icon in the header shows a real-time count of unread notifications. Your full notification inbox is at `/notifications`, where you can see all notifications sorted newest-first (up to 50), mark individual ones as read by clicking them, or mark all as read at once.

**26. How do I mark a notification as read?**
Simply click on any notification in your inbox at `/notifications`. It will be marked as read immediately and the unread counter in the header will update. You can also use the "Mark all as read" button to clear all notifications at once.

**27. Is there a limit to how many notifications I receive?**
Your notifications inbox displays the 50 most recent notifications. Older notifications are not shown but remain in the database. Notifications you haven't read are highlighted with a red badge indicator.

**28. What does the average star rating on a product page represent?**
The average rating shown on the product detail page is calculated from all top-level reviews that include a numeric rating (1–5 stars). It excludes replies and reviews submitted without a rating, and is displayed alongside the total count of rated reviews.

**29. Is there a rate limit on comments?**
Yes. To prevent spam, users are limited to 5 comments per minute. If you exceed this limit, you will see a message asking you to wait a moment before posting again.

**30. What is the admin dashboard?**
The admin dashboard at `/admin` is accessible only to users whose Clerk account has the `isAdmin: true` public metadata flag. It shows platform statistics (total products, total users, total votes, approved/pending/rejected counts) and tools for reviewing pending submissions and managing all products.

**31. How does admin product moderation work?**
Admins see a "Pending Approvals" section listing the most recent pending submissions. Each entry can be approved (status → `approved`) or rejected (status → `rejected`) directly from the dashboard without editing the product.

**32. Can I see who submitted a product?**
Yes. Each product detail page shows the submitter's display name (pulled from Clerk). In the admin dashboard, submission email addresses are also visible alongside each pending product.

**33. What stats does the platform share publicly?**
The homepage hero section displays three community stats: 2,500+ projects shared, 10,000+ active creators, and 50,000+ monthly visitors. These figures reflect the platform's growth milestones.

**34. Is iBuildApps free to use?**
Yes. Browsing, voting, reviewing, and submitting products are all free for registered users. There is no paid tier or premium subscription on the platform currently.

**35. How do I navigate between pages?**
The sticky header provides navigation links to Home, Explore, and How It Works on desktop. On mobile, a hamburger menu opens the same navigation. The header also includes authentication controls (sign in / user profile) and the notification bell.

---

## Section 2: Tech Stack (Next.js / React)

**36. What framework powers iBuildApps?**
iBuildApps is built on **Next.js 16** with the **App Router** and **React 19**. All pages are server components by default, with client components used selectively for interactive features like search, voting buttons, and the review form.

**37. How are pages and routes structured?**
All routes live in the `app/` directory following the Next.js App Router convention. Key routes include `/` (landing), `/explore` (product discovery), `/products/[slug]` (product detail), `/submit` (form), `/admin` (dashboard), and `/notifications` (inbox).

**38. Is there a REST API in iBuildApps?**
No. There is no traditional REST API layer. All data mutations (creating products, voting, reviewing, marking notifications) are handled by **Next.js Server Actions**, which run exclusively on the server. Reads are handled by async Server Components calling query functions directly.

**39. What database does the platform use?**
iBuildApps uses **Neon** — a serverless PostgreSQL provider — as its database. The connection is managed through the `@neondatabase/serverless` driver, which is optimized for edge and serverless runtimes like Vercel.

**40. How is the database schema managed?**
The schema is defined in TypeScript using **Drizzle ORM** (`db/schema.ts`). Four tables are in use: `products`, `votes`, `reviews`, and `notifications`. Migrations are generated with `npx drizzle-kit generate` and applied with `npx drizzle-kit migrate`.

**41. How is authentication handled?**
Authentication is powered by **Clerk** (`@clerk/nextjs`). The root layout wraps the entire application in `<ClerkProvider>`. Clerk issues sessions, manages user profiles, and is the single source of truth for user IDs. Admin access is gated by the `isAdmin` flag in a user's Clerk `publicMetadata` — not a database role.

**42. How is form validation done?**
All form inputs are validated with **Zod** schemas co-located with their domain. The product submission form uses `productSchema`; the review form uses `reviewSchema`. React Hook Form with `@hookform/resolvers/zod` wires Zod into the client-side form. Server Actions run a second Zod validation pass before any database write.

**43. What CSS framework is used?**
The site uses **Tailwind CSS v4** with an OKLCH-based custom color system defined in `app/globals.css`. Class composition uses the `cn()` utility (clsx + tailwind-merge) from `lib/utils.ts`. Animation utilities come from the `tw-animate-css` package.

**44. What component library is used?**
UI primitives come from **shadcn/ui** (New York style, Radix-based, CSS variable tokens). These live in `components/ui/` and should not be hand-edited. Feature-specific components are organized into domain folders like `components/products/`, `components/admin/`, and `components/landing-page/`.

**45. How does real-time data feel work without WebSockets?**
iBuildApps uses Next.js **`revalidatePath`** calls inside Server Actions to bust the cache after mutations (votes, reviews, product approvals). This gives fresh data on the next page load. The review list component also supports optimistic UI updates on the client side to feel instant.

**46. How does the @mention autocomplete work technically?**
The `MentionAutocomplete` component listens to `input` events on the review textarea, detects an `@` character followed by at least two non-whitespace characters, debounces 300ms, then calls a `searchUsersForMention` Server Action that queries Clerk's user list. Results appear in a keyboard-navigable dropdown (arrow keys + Enter to select, Escape to dismiss).

**47. How is rate limiting implemented?**
Rate limiting uses a lightweight **in-memory sliding window** map in `lib/security/rate-limit.ts`. Each unique key (e.g., `toggle_vote_{userId}`) tracks request counts within a configurable window. Voting is limited to 10 toggles/minute; commenting is limited to 5 posts/minute. Note: since Vercel runs serverless, the in-memory cache is not shared across lambda instances but still mitigates rapid single-request abuse.

**48. How is loading state handled across the app?**
Next.js `<Suspense>` boundaries are placed around async data-fetching components. Skeleton components (`ProductSkeleton`, `AdminSkeleton`, `ProductExplorerSkeleton`) render during server data fetching. The product submission button uses React's `useActionState` `isPending` flag to show a spinner during form submission.

**49. How are product slugs enforced for uniqueness?**
The `products` table has a `uniqueIndex` on the `slug` column (`products_slug_idx`). Slugs must match the regex `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase letters, numbers, hyphens only) and be between 3 and 150 characters. Duplicate slug insertion will throw a database constraint error.

**50. What icons does the platform use?**
All icons come from **Lucide React** (`lucide-react`). Icons like `RocketIcon`, `SparkleIcon`, `CompassIcon`, `BellIcon`, `ThumbsUpIcon`, and `StarIcon` are used throughout the UI for navigation, stats, and action buttons.

---

## Section 3: AI Automation (n8n)

**51. Can I submit n8n workflows or automation tools to iBuildApps?**
Absolutely. iBuildApps welcomes any app, tool, or project — including n8n workflows, automation templates, and AI-powered pipelines. Use tags like `Automation`, `n8n`, `No-Code`, or `AI` when submitting to help users discover your tool.

**52. What kinds of automation tools are featured on iBuildApps?**
The platform features a broad range of automation-related products: AI agents, workflow builders, no-code tools, data pipeline utilities, browser automation, and SaaS integrations. If you've built an automation that saves people time, iBuildApps is the right place to launch it.

**53. Does iBuildApps itself use n8n internally?**
The current production codebase does not include an n8n integration. All server-side logic (notifications, moderation, data mutations) is handled by Next.js Server Actions. n8n-based automation could be added in the future to power scheduled tasks, email digests, or external integrations.

**54. Can n8n be used to automate submissions to iBuildApps?**
Not via a public API at this time — the platform uses Next.js Server Actions rather than a REST API. A future webhook or API endpoint could enable n8n workflows to trigger product submissions or pull trending product data automatically.

**55. How do notification triggers work, and could n8n integrate with them?**
Notifications are currently triggered server-side when a user is `@mentioned` in a comment. The notification record stores a type (`mention` or `system`), message text, and a direct link. An n8n webhook node could subscribe to these events if an outbound webhook trigger were added to the notification actions.

**56. What AI tools have been popular on Product Hunt-style platforms like iBuildApps?**
Historically, the most upvoted launches in this category include AI writing assistants, code generation tools, image generation apps, LLM-powered chatbots, and document automation tools. On iBuildApps, filtering the Explore page by the `AI` tag surfaces similar categories.

**57. Can I build an n8n workflow that monitors iBuildApps for new product launches?**
Currently the platform does not expose an RSS feed or public REST endpoint, so polling would require a browser automation approach (e.g., n8n's HTTP Request node + a scraping layer). A native webhook or API feed is a natural future addition for this use case.

**58. Are there plans to add webhook or API support for automation integrations?**
The architecture is well-suited for it — the Server Actions layer could be complemented by API route handlers (`app/api/`) without changing the schema. Adding webhook events for `product.approved` or `review.created` would unlock rich n8n, Zapier, and Make integrations.

**59. How would I tag an n8n-related product submission to maximize discoverability?**
Use tags that match what your tool does: `n8n`, `Automation`, `Workflow`, `No-Code`, `AI`, `Integration`. Tags are comma-separated in the submission form and power the search filter on the Explore page, so specific tags improve discoverability.

**60. What is the best way to describe an automation product when submitting it?**
Lead your tagline with the core outcome (e.g., "Automate your CRM updates with zero code"). Use the description field (up to 1,000 characters) to explain what the workflow does, what tools it connects, and who it's for. Clear descriptions perform better in community search and tend to attract more meaningful reviews.

---

*Document generated from the iBuildApps codebase and platform. Last updated: April 2026.*