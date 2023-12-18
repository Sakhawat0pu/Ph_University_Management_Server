import express from 'express';
import { userControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../students/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import { UserRole } from './users.constants';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth(UserRole.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(UserRole.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(AdminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

export const userRouter = router;
