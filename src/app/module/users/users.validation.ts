import { z } from 'zod';

const createUserSchemaValidation = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, { message: "Password can't be longer than 20 characters!" })
    .optional(), // when creating a user, we are going to create a temporary password, which user can change later
});

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['in-progress', 'blocked']),
  }),
});

export const userSchemaValidation = {
  createUserSchemaValidation,
  changeUserStatusValidationSchema,
};
