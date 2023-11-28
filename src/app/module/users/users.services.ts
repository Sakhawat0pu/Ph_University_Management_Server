import config from '../../config';
import { Student } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './users.interface';
import { UserModel } from './users.model';

const createStudentIntoDb = async (studentData: Student, password: string) => {
  // Using static
  //   if (await StudentModel.isUserExists(student.id)) {
  //     throw new Error('User already exists');
  //   }
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);
  userData.id = '100100001';
  userData.role = 'student';

  const newUser = await UserModel.create(userData);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};

export const userServices = {
  createStudentIntoDb,
};
