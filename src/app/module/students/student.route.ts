import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

// router.post('/create-student', studentController.createStudent);

router.get(
  '/',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty),
  studentController.getStudent,
);

router.get(
  '/:studentId',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty),
  studentController.getSingleStudent,
);

router.patch(
  '/:studentId',
  auth(UserRole.superAdmin, UserRole.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updateStudent,
);

router.delete(
  '/:studentId',
  auth(UserRole.superAdmin, UserRole.admin),
  studentController.deleteSingleStudent,
);

export const studentRouter = router;
