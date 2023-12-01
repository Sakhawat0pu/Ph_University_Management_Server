import express from 'express';
import { academicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.createAcademicFaculty,
);

router.get('/', academicFacultyControllers.getAllAcademicFaculties);

router.get('/:facultyId', academicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  validateRequest(
    academicFacultyValidations.updateAcademicFacultyValidationSchema,
  ),
  academicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRouter = router;
