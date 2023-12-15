import mongoose from 'mongoose';
import QueryBuilder from '../builder/QueryBuilder';
import { courseSearchFields } from './course.constants';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDb = async (payLoad: TCourse) => {
  const result = await CourseModel.create(payLoad);
  return result;
};

const getAllCoursesFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('prerequisiteCourses.course'),
    query,
  )
    .search(courseSearchFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDb = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'prerequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDb = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { idDeleted: true },
    { new: true },
  );
  return result;
};

const updateCourseIntoDb = async (id: string, payLoad: Partial<TCourse>) => {
  const { prerequisiteCourses, ...remainingCourseData } = payLoad;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const updateBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      remainingCourseData,
      { new: true, runValidators: true, session },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course.');
    }

    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      const deletedPrerequisites = prerequisiteCourses
        .filter((item) => item.course && item.isDeleted)
        .map((item) => item.course);

      const deletedPrerequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            prerequisiteCourses: { course: { $in: deletedPrerequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPrerequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course.');
      }

      const newPrerequisites = prerequisiteCourses.filter(
        (item) => item.course && !item.isDeleted,
      );

      const updatedPrerequisitesCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { prerequisiteCourses: { $each: newPrerequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!updatedPrerequisitesCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course.');
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await CourseModel.findById(id).populate(
      'prerequisiteCourses.course',
    );
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course.');
  }
};

const assignFacultyToCourseIntoDb = async (
  id: string,
  payLoad: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payLoad } },
    },
    { upsert: true, new: true },
  );
  return result;
};

const removeFacultyFromCourseFromDb = async (
  id: string,
  payLoad: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    { $pull: { faculties: { $in: payLoad } } },
    { new: true },
  );
  return result;
};

export const courseServices = {
  createCourseIntoDb,
  getAllCoursesFromDb,
  getSingleCourseFromDb,
  deleteCourseFromDb,
  updateCourseIntoDb,
  assignFacultyToCourseIntoDb,
  removeFacultyFromCourseFromDb,
};
