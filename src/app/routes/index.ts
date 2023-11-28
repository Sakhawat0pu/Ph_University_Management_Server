import express from 'express';
import { userRouter } from '../module/users/users.route';
import { studentRouter } from '../module/students/student.route';
import { academicSemesterRouter } from '../module/academicSemester/academicSemester.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/students',
    route: studentRouter,
  },
  {
    path: '/semesters',
    route: academicSemesterRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
