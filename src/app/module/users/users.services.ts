import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './users.interface';
import { UserModel } from './users.model';
import { getGeneratedId } from './users.utils';

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
