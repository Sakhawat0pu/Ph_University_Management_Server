import { z } from 'zod';

const userSchemaValidation = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be string' })
    .max(20, { message: "Password can't be longer than 20 characters!" })
    .optional(), // when creating a user, we are going to create a temporary password, which user can change later
});

export default userSchemaValidation;
