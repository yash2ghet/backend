import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),

  email: z.string().email(),

  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof signupSchema>;

export type LoginInput = z.infer<typeof loginSchema>;