import { SemesterRegistrationModel } from './../semesterRegistration/semesterReg.model';
import { Schema, model } from 'mongoose';
import { TOfferedCourses } from './offeredCourse.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { Days } from './offeredCourse.constant';

const offeredCourseSchema = new Schema<TOfferedCourses>(
  {
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
    course: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: CourseModel,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: FacultyModel,
    },
    maxCapacity: { type: Number, default: 20 },
    section: { type: Number, required: true },
    days: [{ type: String, enum: Days, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const OfferedCourseModel = model<TOfferedCourses>(
  'Offered-courses',
  offeredCourseSchema,
);
