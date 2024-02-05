import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  offeredCourseControllers.getAllOfferedCourse,
);

router.get(
  '/my-offered-courses',
  auth(UserRole.student),
  offeredCourseControllers.getMyOfferedCourses,
);

router.get(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty, UserRole.student),
  offeredCourseControllers.getSingleOfferedCourse,
);

router.patch(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.faculty),
  offeredCourseControllers.deleteOfferedCourse,
);

export const offeredCourseRouter = router;
