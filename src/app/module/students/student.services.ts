import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDb = async (student: Student) => {
  const result = await StudentModel.create(student);
  return result;
};

const getStudentFromDb = async () => {
  const result = await StudentModel.find();
  return result;
};

const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};

export const studentServices = {
  createStudentIntoDb,
  getStudentFromDb,
  getSingeStudentFromDb,
};
