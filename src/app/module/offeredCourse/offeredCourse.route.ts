import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import { offeredCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);

router.get('/', offeredCourseControllers.getAllOfferedCourse);

router.get('/:courseId', offeredCourseControllers.getSingleOfferedCourse);

router.patch(
  '/:courseId',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

router.delete('/:courseId', offeredCourseControllers.deleteOfferedCourse);

export const offeredCourseRouter = router;
