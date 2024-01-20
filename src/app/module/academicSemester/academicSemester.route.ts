import express from 'express';
import { academicSemesterController } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  academicSemesterController.createAcademicSemester,
);

router.get('/', auth('admin'), academicSemesterController.getAcademicSemesters);

router.get(
  '/:semesterId',
  auth('admin'),
  academicSemesterController.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterController.updateAcademicSemester,
);

export const academicSemesterRouter = router;
