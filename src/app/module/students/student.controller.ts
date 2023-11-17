import { Request, Response } from 'express';
import { studentServices } from './student.services';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body.student;
    const result = await studentServices.createStudentIntoDb(student);

    res.status(200).json({
      success: true,
      message: 'Student has been successfully created',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getStudent = async (req: Request, res: Response) => {
  try {
    const result = await studentServices.getStudentFromDb();
    res.status(200).json({
      success: true,
      message: 'Students have been retrieved',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const result = await studentServices.getSingeStudentFromDb(studentId);
    res.status(200).json({
      success: true,
      message: 'Student has been retrieved',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const studentController = {
  createStudent,
  getStudent,
  getSingleStudent,
};
