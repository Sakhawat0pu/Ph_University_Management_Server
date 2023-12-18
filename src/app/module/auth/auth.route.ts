import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidations.loginUserValidationSchema),
  authController.loginUser,
);

router.post(
  '/change-password',
  auth(UserRole.admin, UserRole.faculty, UserRole.student),
  validateRequest(authValidations.changePasswordValidationSchema),
  authController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(authValidations.refreshTokenValidationSchema),
  authController.refreshToken,
);

export const authRouter = router;
