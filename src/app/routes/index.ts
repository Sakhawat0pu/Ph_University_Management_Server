import express from 'express';
import { userRouter } from '../module/users/users.route';
import { studentRouter } from '../module/students/student.route';
import { academicSemesterRouter } from '../module/academicSemester/academicSemester.route';
import { academicFacultyRouter } from '../module/academicFaculty/academicFaculty.route';
import { academicDepartmentRouter } from '../module/academicDepartment/academicDepartment.route';

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
  {
    path: '/faculties',
    route: academicFacultyRouter,
  },
  {
    path: '/departments',
    route: academicDepartmentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
