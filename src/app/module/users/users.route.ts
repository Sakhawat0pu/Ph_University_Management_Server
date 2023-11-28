import express from 'express';
import { userControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../students/student.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

export const userRouter = router;
