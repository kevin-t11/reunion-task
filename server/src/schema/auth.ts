import { z } from 'zod';

// Zod schema for user registration
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(5, 'Email must be at least 5 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Zod schema for user login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(5, 'Email must be at least 5 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
