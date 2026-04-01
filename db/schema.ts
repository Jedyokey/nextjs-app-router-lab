import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    timestamp,
    json,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ PRODUCTS ==============
export const products = pgTable("products", {
    id: serial("id").primaryKey(),

    // Core product info
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    tagline: varchar("tagline", { length: 140 }),
    description: text("description"),

    // Links and media
    websiteUrl: text("website_Url"),
    tags: json("tags").$type<string[]>(), // e.g: ["AI", "Productivity"]

    // Voting
    voteCount: integer("vote_count").notNull().default(0),

    // Metadata
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    status: varchar("status", { length: 20 }).default("pending"), // pending | approved | rejected
    submittedBy: varchar("submitted_by", { length: 120 }).default("anonymous"),
    userId: varchar("user_id", { length: 255 }), // Clerk user ID

    // Organization reference (for backend queries only)
    organizationId: varchar("organization_id", { length: 255 }), // Clerk organization ID
},
    (table) => ({
        slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
        statusIdx: index("products_status_idx").on(table.status),
        updatedAtIdx: index("products_updated_at_idx").on(table.updatedAt),
        organizationIdx: index("products_organization_idx").on(table.organizationId),
    })
);

// ============ VOTES ==============
export const votes = pgTable(
    "votes",
    {
        id: serial("id").primaryKey(),
        productId: integer("product_id").notNull().references(() => products.id, {
            onDelete: "cascade",
        }),
        userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
        createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    },
    (table) => ({
        // Enforce only one vote per user per product
        uniqueVoteIdx: uniqueIndex("votes_product_user_idx").on(
            table.productId,
            table.userId
        ),
        // For querying votes by product or user
        productIdIdx: index("votes_product_id_idx").on(table.productId),
        userIdIdx: index("votes_user_id_idx").on(table.userId),
    })
);

// ============ REVIEWS ==============
export const reviews = pgTable("reviews", {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, {
        onDelete: "cascade",
    }),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID

    // Content
    content: text("content").notNull(),
    rating: integer("rating"), // 1-5 stars, only on top-level reviews (parentId is null)

    // Threading — self-reference for replies 
    parentId: integer("parent_id"),

    // @Mentions — stored as array of Clerk user IDs found in content
    mentions: json("mentions").$type<string[]>(),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    productIdIdx: index("reviews_product_id_idx").on(table.productId),
    userIdIdx: index("reviews_user_id_idx").on(table.userId),
    parentIdIdx: index("reviews_parent_id_idx").on(table.parentId),
}));

// ============ RELATIONS ==============
export const productsRelations = relations(products, ({ many }) => ({
    votes: many(votes),
    reviews: many(reviews),
}));

export const votesRelations = relations(votes, ({ one }) => ({
    product: one(products, {
        fields: [votes.productId],
        references: [products.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    parent: one(reviews, {
        fields: [reviews.parentId],
        references: [reviews.id],
        relationName: "reviewReplies",
    }),
    replies: many(reviews, {
        relationName: "reviewReplies",
    }),
}));