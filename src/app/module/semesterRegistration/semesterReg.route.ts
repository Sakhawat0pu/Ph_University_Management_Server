import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { semesterRegistrationValidations } from './semesterReg.validation';
import { semesterRegistrationControllers } from './semesterReg.controller';

const router = express();

router.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get('/', semesterRegistrationControllers.getAllSemesterRegistration);

router.get(
  '/:registrationId',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:registrationId',
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:registrationId',
  semesterRegistrationControllers.deleteSemesterRegistration,
);

export const semesterRegistrationRouter = router;
