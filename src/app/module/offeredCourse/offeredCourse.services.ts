import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterReg.model';
import { TOfferedCourses, TSchedule } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { hasConflict } from './offeredCourse.utils';
import QueryBuilder from '../builder/QueryBuilder';
import { StudentModel } from '../students/student.model';

const createOfferedCourseIntoDb = async (payLoad: TOfferedCourses) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payLoad;

  const isSemesterRegExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified registered semester does not exist!',
    );
  }

  const academicSemester = isSemesterRegExists?.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified academic faculty does not exist!',
    );
  }

  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified academic department does not exist!',
    );
  }

  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified course does not exist!',
    );
  }

  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified faculty does not exist!',
    );
  }

  const isDepartmentBelongToAcademicFaculty =
    await AcademicDepartmentModel.findOne({
      _id: academicDepartment,
      academicFaculty,
    });

  if (!isDepartmentBelongToAcademicFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${isAcademicDepartmentExists.name} does not belong to ${isAcademicFacultyExists.name}`,
    );
  }

  // a course is offered for multiple sections for a specific registered semester but
  // don't allow multiple documents of a course with same section for a specific registered semester
  const anyOfferedCourseWithRequestedSection = await OfferedCourseModel.findOne(
    {
      semesterRegistration,
      course,
      section,
    },
  );

  if (anyOfferedCourseWithRequestedSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Specified course is being offered for the same registered semester for the same requested section`,
    );
  }

  const reservedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime');

  const requestedSchedules = {
    startTime,
    endTime,
  };

  if (hasConflict(reservedSchedules, requestedSchedules)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Requested time frame is reserved, please choose a different time frame or day',
    );
  }
  const result = await OfferedCourseModel.create({
    ...payLoad,
    academicSemester,
  });
  return result;
};

const updateOfferedCourseIntoDb = async (
  id: string,
  payLoad: Pick<
    TOfferedCourses,
    'faculty' | 'maxCapacity' | 'startTime' | 'endTime' | 'days'
  >,
) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified offered course does not exist!',
    );
  }

  const isFacultyExists = await FacultyModel.findById(payLoad.faculty);
  if (!isFacultyExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified faculty does not exist!',
    );
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const registeredSemester =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (registeredSemester?.status !== 'Upcoming') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Not eligible for update since the registered semester is ${registeredSemester?.status}`,
    );
  }

  const { faculty, days, startTime, endTime } = payLoad;

  const reservedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('startTime endTime');

  const requestedSchedules = {
    startTime,
    endTime,
  };

  if (hasConflict(reservedSchedules, requestedSchedules)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Requested time frame is reserved, please choose a different time frame or day',
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payLoad, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getAllOfferedCourseFromDb = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return { meta, result };
};

const getMyOfferedCoursesFromDb = async (id: string) => {
  const student = await StudentModel.findOne({ id });
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Specified student not found');
  }

  const currentOngoingRegisteredSemester =
    await SemesterRegistrationModel.findOne({
      status: 'Ongoing',
    });
  if (!currentOngoingRegisteredSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'There is no ongoing semester');
  }

  const offeredCourses = await OfferedCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: currentOngoingRegisteredSemester._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolled-courses',
        let: {
          ongoingCourseId: currentOngoingRegisteredSemester._id,
          studentId: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$semesterRegistration', '$$ongoingCourseId'],
                  },
                  {
                    $eq: ['$student', '$$studentId'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolled-courses',
        let: {
          studentId: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$studentId'] },
                  { $eq: ['$isCompleted', true] },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCoursesIds: {
          $map: {
            input: '$completedCourses',
            as: 'completedCourse',
            in: '$$completedCourse.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPrerequisiteSatisfied: {
          $or: [
            { $eq: ['$course.prerequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.prerequisiteCourses.course',
                '$completedCoursesIds',
              ],
            },
          ],
        },
        isCourseAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enrolledCourse',
                in: '$$enrolledCourse.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isCourseAlreadyEnrolled: false,
        isPrerequisiteSatisfied: true,
      },
    },
  ]);
  return offeredCourses;
};

const getSingleOfferedCourseFromDb = async (id: string) => {
  const result = await OfferedCourseModel.findById(id);
  return result;
};

const deleteOfferedCourseFromDb = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified offered course does not exist!',
    );
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const registeredSemester =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (registeredSemester?.status !== 'Upcoming') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Not eligible for deletion since the registered semester is ${registeredSemester?.status}`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const offeredCourseServices = {
  createOfferedCourseIntoDb,
  getAllOfferedCourseFromDb,
  getSingleOfferedCourseFromDb,
  updateOfferedCourseIntoDb,
  deleteOfferedCourseFromDb,
  getMyOfferedCoursesFromDb,
};
