// import { Student } from './student.interface';
import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../users/users.model';
import { Student } from './student.interface';

// const createStudentIntoDb = async (student: Student) => {
//   // Using static
//   if (await StudentModel.isUserExists(student.id)) {
//     throw new Error('User already exists');
//   }

//   const result = await StudentModel.create(student); // built-in static method
//   // Using static

//   /*
//   ** Using method
//   const studentInstance = new StudentModel(student);
//   if (await studentInstance.isUserExists(student.id)) {
//     throw new Error('User already exists');
//   }

//   const result = await studentInstance.save(); // built-in instance method
//   */

//   return result;
// };

const getStudentFromDb = async () => {
  const result = await StudentModel.find() // built-in static method
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id }); // built-in static method
  return result;
};

/* const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.aggregate([{ $match: { id: id } }]); // built-in static method
  return result;
}; */

const updateStudentIntoDb = async (id: string, payLoad: Partial<Student>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payLoad;
  const modifiedData: Record<string, unknown> = { ...remainingStudentData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findOneAndUpdate({ id }, modifiedData, {
    new: true,
  });
  return result;
};

const deleteSingleStudentFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // for findOneAndUpdate, transaction will return the data in object form
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const studentServices = {
  // createStudentIntoDb,
  getStudentFromDb,
  getSingeStudentFromDb,
  updateStudentIntoDb,
  deleteSingleStudentFromDb,
};
