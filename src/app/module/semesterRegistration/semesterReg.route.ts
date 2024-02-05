import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterReg.validation';
import { semesterRegistrationControllers } from './semesterReg.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express();

router.post(
  '/create-semester-registration',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  semesterRegistrationControllers.getAllSemesterRegistration,
);

router.get(
  '/:registrationId',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:registrationId',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:registrationId',
  auth(UserRole.superAdmin, UserRole.admin),
  semesterRegistrationControllers.deleteSemesterRegistration,
);

export const semesterRegistrationRouter = router;
