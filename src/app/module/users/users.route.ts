import express, { NextFunction, Request, Response } from 'express';
import { userControllers } from './users.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../students/student.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import { UserRole } from './users.constants';
import auth from '../../middlewares/auth';
import { userSchemaValidation } from './users.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(UserRole.admin),
  upload.single('imgFile'), // the name of the file 'imgFile' - comes from the name of the key whose value is the img file
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  userControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(UserRole.admin),
  upload.single('imgFile'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userControllers.createFaculty,
);

router.post(
  '/create-admin',
  upload.single('imgFile'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  userControllers.createAdmin,
);

router.get(
  '/me',
  auth(UserRole.admin, UserRole.faculty, UserRole.student),
  userControllers.getMe,
);

router.post(
  '/change-status/:userId',
  auth(UserRole.admin),
  validateRequest(userSchemaValidation.changeUserStatusValidationSchema),
  userControllers.changeStatus,
);
export const userRouter = router;
