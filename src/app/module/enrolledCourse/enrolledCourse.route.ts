import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidations } from './enrolledCourse.validation';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-enroll-course',
  auth('student'),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseController.createEnrolledCourse,
);

router.patch(
  '/update-marks',
  auth('faculty'),
  validateRequest(
    enrolledCourseValidations.updateEnrolledCourseMarkValidationSchema,
  ),
  enrolledCourseController.updateEnrolledCourseMarks,
);

router.get('/', auth('admin'), enrolledCourseController.getAllEnrolledCourses);
export const enrolledCourseRouter = router;
