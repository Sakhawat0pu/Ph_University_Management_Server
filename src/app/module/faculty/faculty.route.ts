import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { updateFacultyValidationSchema } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.get(
  '/:facultyId',
  auth(UserRole.admin, UserRole.faculty, UserRole.superAdmin),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:facultyId',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:facultyId',
  auth(UserRole.admin, UserRole.superAdmin),
  auth(UserRole.admin),
  FacultyControllers.deleteFaculty,
);

router.get(
  '/',
  auth(UserRole.admin, UserRole.faculty, UserRole.superAdmin),
  FacultyControllers.getAllFaculties,
);

export const facultyRouter = router;
