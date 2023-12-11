// import { Student } from './student.interface';
import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../users/users.model';
import { Student } from './student.interface';
import QueryBuilder from '../builder/QueryBuilder';
import { searchFields } from './student.constant';

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

const getStudentFromDb = async (query: Record<string, unknown>) => {
  const searchTerm = query?.searchTerm ? query?.searchTerm : '';
  /*
  const searchFields = ['permanentAddress', 'name.firstName', 'email'];
  const searchQuery = StudentModel.find({
    $or: searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  const queryObj = { ...query };
  const fieldsToBeDeleted = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  fieldsToBeDeleted.forEach((field) => delete queryObj[field]);

  const filterQuery = searchQuery.find(queryObj);

  const sort = query?.sort ? (query?.sort as string) : '-createdAt'; // for sorting function, - means descending order

  const sortQuery = filterQuery.sort(sort);

  const limit = query?.limit ? Number(query?.limit) : 100;
  const page = query?.page ? Number(query?.page) : 1;

  const limitQuery = sortQuery.skip((page - 1) * limit).limit(limit);

  const selectedFields = query?.fields
  /  ? (query?.fields as string).split(',').join(' ')
    : '-__v'; // for selection, - means exclusion, in this case exclusion of '--v' field

  const result = await limitQuery
    .select(selectedFields)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  */
  const returnedQuery = new QueryBuilder(
    StudentModel.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(searchFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const result = await returnedQuery.modelQuery;
  return result;
};

const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.findById(id); // built-in static method
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Student with ${id} does not exits!`,
    );
  }
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

  const result = await StudentModel.findByIdAndUpdate(id, modifiedData, {
    new: true,
  });
  return result;
};

const deleteSingleStudentFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // for findOneAndUpdate, transaction will return the data in object form
    const deletedStudent = await StudentModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const userId = deletedStudent.user;

    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
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
