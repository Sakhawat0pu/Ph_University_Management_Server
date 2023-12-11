import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './users.interface';
import { UserModel } from './users.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './users.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { FacultyModel } from '../faculty/faculty.model';
import { AdminModel } from '../admin/admin.model';

const createStudentIntoDb = async (studentData: Student, password: string) => {
  // Using static
  //   if (await StudentModel.isUserExists(student.id)) {
  //     throw new Error('User already exists');
  //   }
  const academicSemester = (await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  )) as TAcademicSemester;

  if (!academicSemester) {
    throw new AppError(400, 'Academic semester not found');
  }

  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.role = 'student';
  userData.id = await generateStudentId(academicSemester);

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

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'faculty';

  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await FacultyModel.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'admin';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const userServices = {
  createStudentIntoDb,
  createFacultyIntoDB,
  createAdminIntoDB,
};
