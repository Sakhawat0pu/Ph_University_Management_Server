import { NextFunction, Request, Response } from 'express';
import { studentServices } from './student.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchemaJoi from './student.joi.validation';
// import studentValidationSchemaZod from './student.validation';

/*
const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body.student; // res.body returns an object of form {student: {id: ,name: ,.....}}

    
    // data validation using Joi
    // const { error, value } = studentValidationSchemaJoi.validate(student);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'Something went wrong',
    //     error: error.details,
    //   });
    //   return;
    // }

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
*/

const getStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await studentServices.getStudentFromDb();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students have been retrieved',
      data: result,
    });
    // res.status(200).json({
    //   success: true,
    //   message: 'Students have been retrieved',
    //   data: result,
    // });
  },
);

const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.params.studentId;
  const result = await studentServices.getSingeStudentFromDb(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student has been retrieved',
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.studentId;
  const student = req.body.student;
  const result = await studentServices.updateStudentIntoDb(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student has been updated successfully',
    data: result,
  });
});

const deleteSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.studentId;
  const result = await studentServices.deleteSingleStudentFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student has been deleted successfully',
    data: result,
  });
});

export const studentController = {
  // createStudent,
  getStudent,
  getSingleStudent,
  updateStudent,
  deleteSingleStudent,
};
