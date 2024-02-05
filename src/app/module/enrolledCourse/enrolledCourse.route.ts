import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { enrolledCourseValidations } from './enrolledCourse.validation';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.post(
  '/create-enroll-course',
  auth(UserRole.student),
  validateRequest(
    enrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  enrolledCourseController.createEnrolledCourse,
);

router.patch(
  '/update-marks',
  auth(UserRole.superAdmin, UserRole.admin, UserRole.faculty),
  validateRequest(
    enrolledCourseValidations.updateEnrolledCourseMarkValidationSchema,
  ),
  enrolledCourseController.updateEnrolledCourseMarks,
);

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin),
  enrolledCourseController.getAllEnrolledCourses,
);

router.get(
  '/my-enrolled-courses',
  auth(UserRole.student),
  enrolledCourseController.getMyEnrolledCourses,
);

export const enrolledCourseRouter = router;
