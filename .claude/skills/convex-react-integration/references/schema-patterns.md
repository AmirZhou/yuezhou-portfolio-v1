# Advanced Schema Patterns

## Hierarchical Data (Projects → Epics → Stories)

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  epics: defineTable({
    userId: v.string(),
    projectId: v.optional(v.id("projects")),
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"]),

  stories: defineTable({
    userId: v.string(),
    projectId: v.optional(v.id("projects")),
    epicId: v.optional(v.id("epics")),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("confirmed")),
    order: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_project", ["projectId"])
    .index("by_epic", ["epicId"]),
});
```

## Embedded Objects (Persona with Generated Data)

```ts
stories: defineTable({
  userId: v.string(),
  title: v.string(),
  // Embedded object for AI-generated persona
  persona: v.optional(v.object({
    name: v.optional(v.string()),
    age: v.optional(v.string()),
    occupation: v.optional(v.string()),
    background: v.optional(v.string()),
    goals: v.optional(v.array(v.string())),
    painPoints: v.optional(v.array(v.string())),
    // Storage reference for uploaded image
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  })),
  createdAt: v.number(),
})
```

## File Storage References

```ts
files: defineTable({
  userId: v.string(),
  projectId: v.id("projects"),
  storageId: v.id("_storage"),  // Reference to Convex storage
  filename: v.string(),
  mimeType: v.optional(v.string()),
  size: v.optional(v.number()),
  url: v.optional(v.string()),  // Cached URL (may expire)
  extractedText: v.optional(v.string()),  // For processed documents
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_project", ["projectId"]),
```

## Encrypted/Obfuscated Fields (API Keys)

```ts
projects: defineTable({
  userId: v.string(),
  name: v.string(),
  // Store obfuscated API key (not truly encrypted, just reversible)
  encryptedApiKey: v.optional(v.string()),
  apiKeyLastFour: v.optional(v.string()),  // For display purposes
  createdAt: v.number(),
})
```

### Obfuscation Helpers

```ts
// Simple reversible obfuscation (NOT secure encryption)
function obfuscateKey(key: string): string {
  return "prefix_v1_" + key.split("").reverse().join("");
}

function deobfuscateKey(obfuscated: string): string {
  const reversed = obfuscated.slice(10);  // Remove prefix
  return reversed.split("").reverse().join("");
}
```

## Query Patterns for Hierarchical Data

### List with Aggregations

```ts
export const listProjectsWithCounts = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      projects.map(async (project) => {
        const epicCount = await ctx.db
          .query("epics")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()
          .then((e) => e.length);

        const storyCount = await ctx.db
          .query("stories")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect()
          .then((s) => s.length);

        return { ...project, epicCount, storyCount };
      })
    );
  },
});
```

### Cascade Delete Pattern

```ts
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const project = await ctx.db.get(args.id);

    if (!project || project.userId !== userId) {
      throw new Error("Not authorized");
    }

    // 1. Unlink all epics
    const epics = await ctx.db
      .query("epics")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    for (const epic of epics) {
      await ctx.db.patch(epic._id, { projectId: undefined });
    }

    // 2. Unlink all stories
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .collect();

    for (const story of stories) {
      await ctx.db.patch(story._id, { projectId: undefined });
    }

    // 3. Delete project
    await ctx.db.delete(args.id);
  },
});
```

## Batch Operations

### Batch Create

```ts
export const createBatch = mutation({
  args: {
    items: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
    })),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const now = Date.now();
    const ids: Id<"stories">[] = [];

    for (let i = 0; i < args.items.length; i++) {
      const id = await ctx.db.insert("stories", {
        userId,
        projectId: args.projectId,
        title: args.items[i].title,
        description: args.items[i].description,
        status: "draft",
        order: i,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }

    return ids;
  },
});
```

### Batch Delete (with Limit)

```ts
export const deleteBatch = mutation({
  args: {
    ids: v.array(v.id("stories")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Limit batch size to prevent timeout
    const MAX_BATCH = 50;
    if (args.ids.length > MAX_BATCH) {
      throw new Error(`Cannot delete more than ${MAX_BATCH} items at once`);
    }

    let deleted = 0;
    for (const id of args.ids) {
      const item = await ctx.db.get(id);
      if (item && item.userId === userId) {
        await ctx.db.delete(id);
        deleted++;
      }
    }

    return { deleted };
  },
});
```

## Migration Pattern

```ts
// One-time migration mutation
export const migrateData = mutation({
  handler: async (ctx) => {
    // Example: Convert category field to epicId
    const stories = await ctx.db.query("stories").collect();

    const categoryToEpic: Record<string, Id<"epics">> = {};

    for (const story of stories) {
      if (story.category && !story.epicId) {
        // Create epic if doesn't exist
        if (!categoryToEpic[story.category]) {
          const epicId = await ctx.db.insert("epics", {
            userId: story.userId,
            name: story.category,
            order: Object.keys(categoryToEpic).length,
            createdAt: Date.now(),
          });
          categoryToEpic[story.category] = epicId;
        }

        // Update story with epicId
        await ctx.db.patch(story._id, {
          epicId: categoryToEpic[story.category],
        });
      }
    }

    return { migrated: stories.length };
  },
});
```
