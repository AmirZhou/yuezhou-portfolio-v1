import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published")
      .filter((q) => q.neq(q.field("publishedAt"), undefined))
      .order("desc")
      .collect();

    return Promise.all(posts.map(async (post) => ({
      ...post,
      coverImageUrl: post.coverImage ? await ctx.storage.getUrl(post.coverImage) : null,
    })));
  },
});

export const getPost = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!post) return null;

    return {
      ...post,
      coverImageUrl: post.coverImage ? await ctx.storage.getUrl(post.coverImage) : null,
    };
  },
});

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    return Promise.all(posts.map(async (post) => ({
      ...post,
      coverImageUrl: post.coverImage ? await ctx.storage.getUrl(post.coverImage) : null,
    })));
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("posts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      publishedAt: args.publish ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    publish: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Post not found");

    await ctx.db.patch(args.id, {
      title: args.title,
      slug: args.slug,
      content: args.content,
      excerpt: args.excerpt,
      publishedAt: args.publish ? (existing.publishedAt ?? Date.now()) : undefined,
      updatedAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
