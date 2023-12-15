import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterReg.interface';
import { SemesterRegistrationModel } from './semesterReg.model';
import QueryBuilder from '../builder/QueryBuilder';
import { semesterStatus } from './semesterReg.constants';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import mongoose from 'mongoose';

const createSemesterRegistrationIntoDb = async (
  payLoad: TSemesterRegistration,
) => {
  // if there is any upcoming or ongoing registered semester, we won't register another semester
  const anyUpcomingOrOngoingSemester = await SemesterRegistrationModel.findOne({
    $or: [
      { status: semesterStatus.upcoming },
      { status: semesterStatus.ongoing },
    ],
  });

  if (anyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${anyUpcomingOrOngoingSemester.status} registered semester.`,
    );
  }

  const academicSemester = payLoad?.academicSemester;
  const isAcademicSemesterExists =
    await AcademicSemesterModel.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified academic semester not found',
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Semester registration already exists',
    );
  }

  const result = await SemesterRegistrationModel.create(payLoad);
  return result;
};

const getAllSemesterRegistrationsFromDb = async (
  query: Record<string, unknown>,
) => {
  const semesterRegQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const result = await semesterRegQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDb = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDb = async (
  id: string,
  payLoad: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistered = await SemesterRegistrationModel.findById(id);

  if (!isSemesterRegistered) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'The specified semester not found',
    );
  }

  const semesterCurrentStatus = isSemesterRegistered.status;
  const requestedSemesterStatus = payLoad.status;

  if (semesterCurrentStatus === semesterStatus.ended) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'The specified semester has already been ended, not eligible for update',
    );
  }

  if (
    semesterCurrentStatus === semesterStatus.upcoming &&
    requestedSemesterStatus === semesterStatus.ended
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester status can't be updated from ${semesterCurrentStatus} to ${requestedSemesterStatus}`,
    );
  }

  if (
    semesterCurrentStatus === semesterStatus.ongoing &&
    requestedSemesterStatus === semesterStatus.upcoming
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Semester status can't be updated from ${semesterCurrentStatus} to ${requestedSemesterStatus}`,
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payLoad,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteSemesterRegistrationFromDb = async (id: string) => {
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Specified semester registration does not exists',
    );
  }

  const registeredSemesterStatus = isSemesterRegistrationExists.status;
  if (registeredSemesterStatus !== 'Upcoming') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Not eligible for deletion, since the course is ${registeredSemesterStatus}`,
    );
  }

  const offeredCoursesUnderTheRegisteredSemester =
    await OfferedCourseModel.find({ semesterRegistration: id }).select('_id');

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    for (const offeredCourse of offeredCoursesUnderTheRegisteredSemester) {
      const deletedCourse = await OfferedCourseModel.findByIdAndDelete(
        offeredCourse._id,
        { session },
      );

      if (!deletedCourse) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Failed to delete registered semester, offered courses under the registered semester can't be deleted",
        );
      }
    }

    const deletedRegisteredSemester =
      await SemesterRegistrationModel.findByIdAndDelete(id);

    if (!deletedRegisteredSemester) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete registered semester!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedRegisteredSemester;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete registered semester',
    );
  }
};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationsFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationIntoDb,
  deleteSemesterRegistrationFromDb,
};
