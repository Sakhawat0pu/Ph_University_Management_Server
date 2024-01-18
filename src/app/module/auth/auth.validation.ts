import { z } from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is required.' }),
    password: z.string({ required_error: 'Password is required.' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required.' }),
    newPassword: z.string({ required_error: 'New password is required.' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is required.' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Old password is required.' }),
    newPassword: z.string({ required_error: 'New password is required.' }),
  }),
});

export const authValidations = {
  loginUserValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
