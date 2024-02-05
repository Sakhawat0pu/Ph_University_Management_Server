import express from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';
import { UserRole } from '../users/users.constants';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    academicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
);

router.get('/', academicFacultyControllers.getAllAcademicFaculties);

router.get('/:facultyId', academicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(
    academicFacultyValidations.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRouter = router;
