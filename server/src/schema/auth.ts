import { z } from "zod";

// Zod schema for user registration
export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be at most 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be at most 50 characters"),
  email: z.string().email("Invalid email address").min(5, "Email must be at least 5 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Zod schema for user login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(5, "Email must be at least 5 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
