import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDb = async (student: Student) => {
  const result = await StudentModel.create(student); // built-in static method
  return result;
};

const getStudentFromDb = async () => {
  const result = await StudentModel.find(); // built-in static method
  return result;
};

const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id }); // built-in static method
  return result;
};

export const studentServices = {
  createStudentIntoDb,
  getStudentFromDb,
  getSingeStudentFromDb,
};
