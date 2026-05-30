import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
const role = z.enum(['user', 'admin']);

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

export const userIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(60),
    email: z.email(),
    password: z.string().min(8).max(128),
    role: role.optional(),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      name: z.string().trim().min(2).max(60),
      email: z.email(),
      role,
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, 'At least one field is required'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];