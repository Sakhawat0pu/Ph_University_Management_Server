import express from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { courseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../users/users.constants';

const router = express.Router();

router.post(
  '/create-course',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);

router.patch(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidations.facultiesToCourseValidationSchema),
  courseControllers.assignFacultyToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(UserRole.admin, UserRole.superAdmin),
  validateRequest(courseValidations.facultiesToCourseValidationSchema),
  courseControllers.removeFacultyFromCourse,
);

router.get(
  '/',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  courseControllers.getAllCourses,
);

router.get(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  courseControllers.getSingleCourse,
);

router.get(
  '/:courseId/get-faculties',
  auth(UserRole.admin, UserRole.superAdmin, UserRole.student, UserRole.faculty),
  courseControllers.getFacultiesForACourse,
);

router.delete(
  '/:courseId',
  auth(UserRole.admin, UserRole.superAdmin),
  courseControllers.deleteCourse,
);

export const courseRouter = router;
