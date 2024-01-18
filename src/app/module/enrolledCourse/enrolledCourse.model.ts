import { Schema, model } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.iterface';
import { number } from 'joi';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterReg.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { CourseModel } from '../course/course.model';
import { StudentModel } from '../students/student.model';
import { FacultyModel } from '../faculty/faculty.model';
import { Grade } from './enrolledCourse.constants';

const courseMarkSchema = new Schema<TCourseMarks>(
  {
    classTest1: { type: Number, min: 0, max: 10, default: 0 },
    midTerm: { type: Number, min: 0, max: 30, default: 0 },
    classTest2: { type: Number, min: 0, max: 10, default: 0 },
    finalTerm: { type: Number, min: 0, max: 50, default: 0 },
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new Schema<TEnrolledCourse>({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: SemesterRegistrationModel,
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: AcademicSemesterModel,
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: AcademicFacultyModel,
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: AcademicDepartmentModel,
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: OfferedCourseModel,
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CourseModel,
  },
  student: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: StudentModel,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: FacultyModel,
  },
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  courseMark: {
    type: courseMarkSchema,
    default: {},
  },
  grade: {
    type: String,
    enum: Grade,
    default: 'NA',
  },
  gradePoints: { type: Number, min: 0, max: 4, default: 0 },
  isCompleted: { type: Boolean, default: false },
});

export const EnrolledCourseModel = model<TEnrolledCourse>(
  'enrolled-courses',
  enrolledCourseSchema,
);
