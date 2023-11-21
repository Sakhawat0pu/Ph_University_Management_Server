import { Student } from './student.interface';
import { StudentModel } from './student.model';

const createStudentIntoDb = async (student: Student) => {
  // Using static
  if (await StudentModel.isUserExists(student.id)) {
    throw new Error('User already exists');
  }

  const result = await StudentModel.create(student); // built-in static method
  // Using static

  /*
  ** Using method
  const studentInstance = new StudentModel(student);
  if (await studentInstance.isUserExists(student.id)) {
    throw new Error('User already exists');
  }
  
  const result = await studentInstance.save(); // built-in instance method
  */

  return result;
};

const getStudentFromDb = async () => {
  const result = await StudentModel.find(); // built-in static method
  return result;
};

/*
const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.findOne({ id }); // built-in static method
  return result;
};
*/

const getSingeStudentFromDb = async (id: string) => {
  const result = await StudentModel.aggregate([{ $match: { id: id } }]); // built-in static method
  return result;
};

const deleteSingleStudentFromDb = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true });
  return result;
};

export const studentServices = {
  createStudentIntoDb,
  getStudentFromDb,
  getSingeStudentFromDb,
  deleteSingleStudentFromDb,
};
