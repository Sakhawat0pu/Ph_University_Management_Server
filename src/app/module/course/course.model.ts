import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPrerequisiteCourse,
} from './course.interface';
import { FacultyModel } from '../faculty/faculty.model';

const prerequisiteCourseSchema = new Schema<TPrerequisiteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Courses',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    trim: true,
    unique: true,
    require: [true, 'Title is required'],
  },
  prefix: {
    type: String,
    trim: true,
    require: [true, 'Prefix is required'],
  },
  code: {
    type: Number,
    trim: true,
    require: [true, 'Code field is required'],
  },
  credits: {
    type: Number,
    trim: true,
    require: [true, 'Credits field is required'],
  },
  prerequisiteCourses: {
    type: [prerequisiteCourseSchema],
  },
  isDeleted: { type: Boolean, default: false },
});

export const CourseModel = model<TCourse>('Courses', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: { type: Schema.Types.ObjectId, required: true, ref: CourseModel },
  faculties: [{ type: Schema.Types.ObjectId, ref: FacultyModel }],
});

export const CourseFacultyModel = model<TCourseFaculty>(
  'Course-Faculties',
  courseFacultySchema,
);
