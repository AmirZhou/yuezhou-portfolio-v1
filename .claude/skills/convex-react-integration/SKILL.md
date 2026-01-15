---
name: convex-react-integration
description: Complete Convex backend integration patterns for React applications with Clerk authentication. Use this skill when setting up Convex with React, implementing CRUD operations, file uploads, rate limiting, or external API integrations via actions. Triggers on requests for real-time databases, Convex setup, or serverless backend with React.
---

# Convex React Integration

Production-ready patterns for integrating Convex with React applications, including Clerk auth, schema design, and advanced features.

## Setup

### Provider Configuration

```tsx
// src/components/providers.tsx
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Auth Config

```ts
// convex/auth.config.ts
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

## Authentication Helper

```ts
// convex/lib/auth.ts
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getAuthUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated. Please sign in.");
  }
  return identity.subject;
}

// For queries that should return null instead of throwing
export async function getOptionalUserId(ctx: QueryCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}
```

## Schema Design

### User-Owned Table Pattern

```ts
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"]),

  items: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    title: v.string(),
    content: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"]),
});
```

### Indexing Strategy

- Single-field indexes for common filters: `by_user`, `by_project`
- Composite indexes for combined filters: `by_user_status`
- Always include `userId` index on user-owned tables

## CRUD Patterns

### Query with Ownership

```ts
// convex/projects.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "./lib/auth";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (args.status) {
      return ctx.db
        .query("projects")
        .withIndex("by_user_status", (q) =>
          q.eq("userId", userId).eq("status", args.status!)
        )
        .collect();
    }

    return ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.id);

    if (!project || project.userId !== userId) {
      return null;
    }

    return project;
  },
});
```

### Mutation with Ownership Verification

```ts
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const now = Date.now();

    return ctx.db.insert("projects", {
      userId,
      name: args.name,
      description: args.description,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const existing = await ctx.db.get(args.id);

    if (!existing || existing.userId !== userId) {
      throw new Error("Project not found or not authorized");
    }

    const updates: Partial<typeof existing> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const existing = await ctx.db.get(args.id);

    if (!existing || existing.userId !== userId) {
      throw new Error("Project not found or not authorized");
    }

    // Cascade: unlink related items
    const items = await ctx.db
      .query("items")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    await ctx.db.delete(args.id);
  },
});
```

## Frontend Usage

### Queries and Mutations

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function ProjectList() {
  // Query with conditional execution
  const projects = useQuery(api.projects.list, { status: "active" });

  // Skip query until ready
  const projectId = selectedId;
  const project = useQuery(
    api.projects.get,
    projectId ? { id: projectId } : "skip"
  );

  // Mutations
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  const handleCreate = async () => {
    const id = await createProject({ name: "New Project" });
    console.log("Created:", id);
  };

  if (projects === undefined) return <Loading />;

  return (
    <ul>
      {projects.map((p) => (
        <li key={p._id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## File Upload

### Generate Upload URL

```ts
// convex/files.ts
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getAuthUserId(ctx); // Ensure authenticated
    return ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    projectId: v.id("projects"),
    filename: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const url = await ctx.storage.getUrl(args.storageId);

    return ctx.db.insert("files", {
      userId,
      projectId: args.projectId,
      storageId: args.storageId,
      filename: args.filename,
      url,
      createdAt: Date.now(),
    });
  },
});
```

### Frontend Upload

```tsx
function FileUploader({ projectId }: { projectId: Id<"projects"> }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const handleUpload = async (file: File) => {
    // Step 1: Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Step 2: Upload file directly to Convex storage
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    // Step 3: Save file record
    await saveFile({
      storageId,
      projectId,
      filename: file.name,
    });
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

## Actions (External APIs)

```ts
// convex/ai.ts
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const generateContent = action({
  args: {
    prompt: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    // 2. Get data via internal query
    const project = await ctx.runQuery(api.projects.get, { id: args.projectId });
    if (!project) throw new Error("Project not found");

    // 3. Call external API
    const response = await fetch("https://api.example.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({ prompt: args.prompt }),
    });

    const data = await response.json();

    // 4. Save result via internal mutation
    await ctx.runMutation(internal.ai.saveResult, {
      projectId: args.projectId,
      content: data.content,
      userId,
    });

    return { success: true, content: data.content };
  },
});
```

## Rate Limiting

```ts
// convex/rateLimits.ts
import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  createProject: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 5 },
  aiGeneration: { kind: "fixed window", rate: 10, period: HOUR },
});

// Usage in mutation
export const create = mutation({
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    await rateLimiter.limit(ctx, "createProject", { key: userId, throws: true });
    // ... rest of mutation
  },
});
```

## Resources

- See `references/schema-patterns.md` for advanced schema designs
- See `references/file-upload.md` for complex file processing workflows
