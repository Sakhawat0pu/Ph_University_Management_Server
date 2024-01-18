import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { StudentModel } from '../students/student.model';
import { TEnrolledCourse } from './enrolledCourse.iterface';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { EnrolledCourseModel } from './enrolledCourse.model';
import mongoose from 'mongoose';
import { CourseModel } from '../course/course.model';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterReg.model';
import { FacultyModel } from '../faculty/faculty.model';
import { calculateGradeAndGradePoint } from './enrolledCourse.utils';

const createEnrolledCourseIntoDb = async (
  id: string,
  payLoad: Partial<TEnrolledCourse>,
) => {
  const user = await StudentModel.findOne({ id }, { _id: 1 });

  const isOfferedCourseExists = await OfferedCourseModel.findById(
    payLoad?.offeredCourse,
  );
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified offered course not found',
    );
  }

  if (isOfferedCourseExists?.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No seat available');
  }

  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse: payLoad?.offeredCourse,
    student: user?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You are already enrolled in this course',
    );
  }

  const course = await CourseModel.findById(
    isOfferedCourseExists.course,
  ).select('credits');

  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const maxCreditsAllowedToEnroll = semesterRegistration?.maxCredit;

  const totalCredits = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists?.semesterRegistration,
        student: user?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'totalEnrolledCourses',
      },
    },
    {
      $unwind: '$totalEnrolledCourses',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$totalEnrolledCourses.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalCreditsEnrolledIn =
    totalCredits.length > 0 ? totalCredits[0].totalEnrolledCredits : 0;

  if (
    totalCreditsEnrolledIn &&
    maxCreditsAllowedToEnroll &&
    totalCreditsEnrolledIn + course?.credits > maxCreditsAllowedToEnroll
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have enrolled for maximum numbers of credits',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicFaculty: isOfferedCourseExists?.academicFaculty,
          academicDepartment: isOfferedCourseExists?.academicDepartment,
          offeredCourse: payLoad?.offeredCourse,
          course: isOfferedCourseExists?.course,
          faculty: isOfferedCourseExists?.faculty,
          student: user?._id,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (result.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in the course',
      );
    }

    const updatedDoc = await OfferedCourseModel.findByIdAndUpdate(
      payLoad.offeredCourse,
      {
        maxCapacity: isOfferedCourseExists.maxCapacity - 1,
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedDoc) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in the course',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return result[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateEnrolledCourseMarksIntoDb = async (
  facultyId: string,
  payLoad: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMark } = payLoad;

  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified offered course not found',
    );
  }

  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified registered semester not found',
    );
  }

  const isStudentExists = await StudentModel.findById(student);
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified student not found');
  }

  const faculty = await FacultyModel.findOne({ id: facultyId }, { _id: 1 });
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified faculty not found');
  }
  const doesCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  });

  if (!doesCourseBelongToFaculty) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to change the marks',
    );
  }

  const modifiedData: Record<string, unknown> = {};

  if (courseMark?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      doesCourseBelongToFaculty.courseMark;
    const totalMark = classTest1 + classTest2 + midTerm + finalTerm;
    const { grade, gradePoint } = calculateGradeAndGradePoint(totalMark);
    modifiedData.grade = grade;
    modifiedData.gradePoints = gradePoint;
    modifiedData.isCompleted = true;
  }

  if (courseMark && Object.keys(courseMark).length) {
    for (const [key, value] of Object.entries(courseMark)) {
      modifiedData[`courseMark.${key}`] = value;
    }
  }

  const result = await EnrolledCourseModel.findByIdAndUpdate(
    doesCourseBelongToFaculty._id,
    modifiedData,
    { new: true, runValidators: true },
  );
  return result;
};

const getAllEnrolledCoursesFromDb = async () => {
  const result = await EnrolledCourseModel.find();
  return result;
};

export const enrolledCourseServices = {
  createEnrolledCourseIntoDb,
  updateEnrolledCourseMarksIntoDb,
  getAllEnrolledCoursesFromDb,
};
