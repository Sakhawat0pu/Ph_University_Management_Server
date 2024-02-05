import express from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.post(
  '/create-academic-semester',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  academicSemesterController.createAcademicSemester,
);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  academicSemesterController.getAcademicSemesters,
);

router.get(
  '/:semesterId',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty, UserRole.student),
  academicSemesterController.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterController.updateAcademicSemester,
);

export const academicSemesterRouter = router;
