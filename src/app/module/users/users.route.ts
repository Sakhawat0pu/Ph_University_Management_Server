import express from 'express';
import { userControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../students/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-student',
  validateRequest(AdminValidations.createAdminValidationSchema),
  userControllers.createStudent,
);

export const userRouter = router;
