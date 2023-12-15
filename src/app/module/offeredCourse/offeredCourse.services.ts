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

const getAllOfferedCourseFromDb = async () => {
  const result = await OfferedCourseModel.find();
  return result;
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
};
