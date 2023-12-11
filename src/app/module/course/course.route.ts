import express from 'express';
import { courseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { courseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);

router.patch(
  '/:courseId',
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidations.facultiesToCourseValidationSchema),
  courseControllers.assignFacultyToCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseValidations.facultiesToCourseValidationSchema),
  courseControllers.removeFacultyFromCourse,
);

router.get('/', courseControllers.getAllCourses);

router.get('/:courseId', courseControllers.getSingleCourse);

router.delete('/:courseId', courseControllers.deleteCourse);

export const courseRouter = router;
