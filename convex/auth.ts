import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const verifyPassword = mutation({
  args: { password: v.string() },
  handler: async (_ctx, args) => {
    // In production, this should come from environment variables
    // For Convex, use the dashboard to set ADMIN_PASSWORD environment variable
    const adminPassword = "admin123"; // TODO: Replace with env var from Convex dashboard
    return args.password === adminPassword;
  },
});
