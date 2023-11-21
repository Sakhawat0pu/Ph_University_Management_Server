import { Request, Response } from 'express';
import { studentServices } from './student.services';
import studentValidationSchemaJoi from './student.joi.validation';
import studentValidationSchemaZod from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body.student; // res.body returns an object of form {student: {id: ,name: ,.....}}

    /*
    // data validation using Joi
    const { error, value } = studentValidationSchemaJoi.validate(student);

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details,
      });
      return;
    }
    */
    // data validation using Zod

    // parse returns the value if the provided data is in correct format, otherwise it throws an error.
    const value = studentValidationSchemaZod.parse(student);

    const result = await studentServices.createStudentIntoDb(value);

    res.status(200).json({
      success: true,
      message: 'Student has been successfully created',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
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

const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.studentId;
    const result = await studentServices.deleteSingleStudentFromDb(id);
    res.status(200).json({
      success: true,
      message: 'Student has been deleted successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

export const studentController = {
  createStudent,
  getStudent,
  getSingleStudent,
  deleteSingleStudent,
};
