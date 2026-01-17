import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_published", ["publishedAt"]),
});
