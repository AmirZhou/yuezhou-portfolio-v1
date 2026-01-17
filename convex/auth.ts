import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const verifyPassword = mutation({
  args: { password: v.string() },
  handler: async (_ctx, args) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not set in Convex environment variables");
      return false;
    }
    return args.password === adminPassword;
  },
});
