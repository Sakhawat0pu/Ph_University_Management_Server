import express from 'express';
import { userRouter } from '../module/users/users.route';
import { studentRouter } from '../module/students/student.route';
import { academicSemesterRouter } from '../module/academicSemester/academicSemester.route';
import { academicFacultyRouter } from '../module/academicFaculty/academicFaculty.route';
import { academicDepartmentRouter } from '../module/academicDepartment/academicDepartment.route';
import { facultyRouter } from '../module/faculty/faculty.route';
import { adminRouter } from '../module/admin/admin.route';
import { courseRouter } from '../module/course/course.route';

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
  {
    path: '/faculty',
    route: facultyRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
  {
    path: '/course',
    route: courseRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
