import express from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

// router.post('/create-student', studentController.createStudent);

router.get('/', studentController.getStudent);

router.get('/:studentId', studentController.getSingleStudent);

router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updateStudent,
);

router.delete('/:studentId', studentController.deleteSingleStudent);

export const studentRouter = router;
