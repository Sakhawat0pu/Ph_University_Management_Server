import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { updateFacultyValidationSchema } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.get('/:facultyId', FacultyControllers.getSingleFaculty);

router.patch(
  '/:facultyId',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:facultyId', FacultyControllers.deleteFaculty);

router.get('/', FacultyControllers.getAllFaculties);

export const facultyRouter = router;
