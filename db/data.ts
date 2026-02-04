// All products data - matches schema.ts structure

export const allProducts = [
    {
        id: 1,
        name: "Modern Full Stack Next.js Course",
        slug: "modern-full-stack-nextjs-course",
        tagline: "learn to build modern full stack application with Next.js",
        description: "Learn to build modern full stack application with Next.js 16",
        websiteUrl: "https://nextjscourse.dev",
        tags: ["Next.js", "Tailwind CSS", "Full Stack"],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "approved" as const,
        submittedBy: "john@example.com",
        voteCount: 120,
    },
    {
        id: 2,
        name: "AI Resume Builder",
        slug: "ai-resume-builder",
        tagline: "Create professional resumes using AI",
        description: "An AI-powered tool to generate job-winning resumes in minutes.",
        websiteUrl: "https://airesume.dev",
        tags: ["AI", "Careers", "Productivity"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        approvedAt: null,
        status: "pending" as const,
        submittedBy: "sarah@example.com",
        voteCount: 0,
    },
    {
        id: 3,
        name: "Crypto Signal Bot",
        slug: "crypto-signal-bot",
        tagline: "Get daily crypto trading signals",
        description: "Automated crypto signals for day traders.",
        websiteUrl: "https://cryptosignals.dev",
        tags: ["Crypto", "Trading", "Bots"],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        approvedAt: null,
        status: "rejected" as const,
        submittedBy: "mark@example.com",
        voteCount: 3,
    },
    {
        id: 4,
        name: "Team Sync Dashboard",
        slug: "team-sync-dashboard",
        tagline: "Keep your remote team in sync",
        description: "A dashboard for tracking tasks, updates, and team progress.",
        websiteUrl: "https://teamsync.app",
        tags: ["SaaS", "Remote Work", "Productivity"],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // approved 5 days ago
        status: "approved" as const,
        submittedBy: "linda@example.com",
        voteCount: 54,
    },
    {
        id: 5,
        name: "Startup Idea Validator",
        slug: "startup-idea-validator",
        tagline: "Validate startup ideas with real feedback",
        description: "Collect feedback and validate ideas before you build.",
        websiteUrl: "https://ideavalidator.io",
        tags: ["Startups", "Validation", "Tools"],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        approvedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // approved 10 hours ago
        status: "approved" as const,
        submittedBy: "founder@example.com",
        voteCount: 18,
    },
    {
        id: 6,
        name: "AI Resume Reviewer",
        slug: "ai-resume-reviewer",
        tagline: "Get instant feedback on your resume using AI",
        description: "Upload your resume and receive AI-powered suggestions to improve it.",
        websiteUrl: "https://airesumereviewer.io",
        tags: ["AI", "Careers", "Productivity"],
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
        approvedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
        status: "approved" as const,
        submittedBy: "careercoach@example.com",
        voteCount: 42,
    },
    {
        id: 7,
        name: "SaaS Pricing Calculator",
        slug: "saas-pricing-calculator",
        tagline: "Find the right pricing for your SaaS",
        description: "Calculate profitable and competitive SaaS pricing in minutes.",
        websiteUrl: "https://saaspricingcalc.com",
        tags: ["SaaS", "Finance", "Startups"],
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        approvedAt: new Date(Date.now() - 45 * 60 * 60 * 1000),
        status: "approved" as const,
        submittedBy: "builder@example.com",
        voteCount: 227,
    },
    {
        id: 8,
        name: "AI Writing Assistant",
        slug: "ai-writing-assistant",
        tagline: "Boost your writing with AI suggestions",
        description: "An AI-powered writing assistant to help you draft, edit, and improve content quickly.",
        websiteUrl: "https://aiwriting.io",
        tags: ["AI", "Productivity", "Writing"],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // approved 1 day ago
        status: "approved" as const,
        submittedBy: "emma@example.com",
        voteCount: 145,
    }, 
]