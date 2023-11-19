import { Request, Response } from 'express';
import { studentServices } from './student.services';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body.student; // res.body returns an object of form {student: {id: ,name: ,.....}}
    const { error, value } = studentValidationSchema.validate(student);
    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details,
      });
      return;
    }
    const result = await studentServices.createStudentIntoDb(value);

    res.status(200).json({
      success: true,
      message: 'Student has been successfully created',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

export const studentController = {
  createStudent,
  getStudent,
  getSingleStudent,
};
