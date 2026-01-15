# File Upload Patterns

## Basic Upload Flow

```
Frontend → generateUploadUrl() → Direct upload to Convex → saveFile()
```

## Multi-Step Processing Flow

For files that need processing (text extraction, image manipulation, etc.):

```
Frontend → generateUploadUrl() → Upload → processFile (action) → saveResult (mutation)
```

## Frontend Upload Component

```tsx
import { useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

interface FileUploaderProps {
  projectId: Id<"projects">;
  onUploadComplete?: (fileId: Id<"files">) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export function FileUploader({
  projectId,
  onUploadComplete,
  accept = "*/*",
  maxSize = 10_000_000, // 10MB default
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is ${maxSize / 1_000_000}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Step 1: Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload directly to Convex storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await response.json();

      // Step 3: Save file record
      const fileId = await saveFile({
        storageId,
        projectId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      });

      onUploadComplete?.(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span>Uploading...</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
```

## Backend: File Processing Action

```ts
// convex/files.ts
import { action, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Limits
const LIMITS = {
  maxFileSize: 10_000_000, // 10MB
  maxFiles: 10,
  maxTotalChars: 500_000,
};

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return ctx.storage.generateUploadUrl();
  },
});

export const processUploadedFile = action({
  args: {
    storageId: v.id("_storage"),
    projectId: v.id("projects"),
    filename: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;

    try {
      // Get file URL
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) throw new Error("File not found");

      // Call external processing service
      const response = await fetch(`${process.env.PROCESSING_API}/extract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          fileUrl,
          filename: args.filename,
        }),
      });

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`);
      }

      const { extractedText, metadata } = await response.json();

      // Validate size
      if (extractedText.length > LIMITS.maxTotalChars) {
        throw new Error("Extracted text exceeds maximum allowed size");
      }

      // Save processed file
      const fileId = await ctx.runMutation(internal.files.saveProcessedFile, {
        userId,
        projectId: args.projectId,
        storageId: args.storageId,
        filename: args.filename,
        extractedText,
        metadata,
      });

      return { success: true, fileId };
    } catch (error) {
      // Clean up on error
      try {
        await ctx.storage.delete(args.storageId);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  },
});

export const saveProcessedFile = internalMutation({
  args: {
    userId: v.string(),
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    filename: v.string(),
    extractedText: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);

    return ctx.db.insert("files", {
      userId: args.userId,
      projectId: args.projectId,
      storageId: args.storageId,
      filename: args.filename,
      url,
      extractedText: args.extractedText,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});
```

## Image Upload with Preview

```tsx
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await response.json();
      onUpload(storageId);
    } catch (err) {
      console.error("Upload failed:", err);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: 200, opacity: uploading ? 0.5 : 1 }}
        />
      )}
    </div>
  );
}
```

## Delete File with Storage Cleanup

```ts
export const deleteFile = mutation({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const file = await ctx.db.get(args.id);

    if (!file || file.userId !== userId) {
      throw new Error("File not found or not authorized");
    }

    // Delete from storage
    if (file.storageId) {
      try {
        await ctx.storage.delete(file.storageId);
      } catch {
        // Storage may already be deleted, continue
      }
    }

    // Delete record
    await ctx.db.delete(args.id);
  },
});
```

## Get Fresh URL (URLs can expire)

```ts
export const getFileUrl = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) return null;

    // Always get fresh URL
    const url = await ctx.storage.getUrl(file.storageId);
    return { ...file, url };
  },
});
```
