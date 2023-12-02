import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './users.interface';
import { UserModel } from './users.model';
import { getGeneratedId } from './users.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createStudentIntoDb = async (studentData: Student, password: string) => {
  // Using static
  //   if (await StudentModel.isUserExists(student.id)) {
  //     throw new Error('User already exists');
  //   }
  const academicSemester = (await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  )) as TAcademicSemester;

  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'student';
  userData.id = await getGeneratedId(academicSemester);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Transaction - 1 [when using transaction, in the create method data needs to provided in an array of object
    // and data will be returned as an array of object]
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a User');
    }

    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;

    // transaction - 2
    const newStudent = await StudentModel.create([studentData], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent[0];
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const userServices = {
  createStudentIntoDb,
};
