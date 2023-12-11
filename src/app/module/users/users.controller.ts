import { NextFunction, Request, Response } from 'express';
import { userServices } from './users.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = req.body.student; // res.body returns an object of form {student: {id: ,name: ,.....}}
    const password = req.body.password;
    // parse returns the value if the provided data is in correct format, otherwise it throws an error.
    // const value = userSchemaValidation.parse(student);

    const result = await userServices.createStudentIntoDb(student, password);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student has been successfully created',
      data: result,
    });

    // res.status(200).json({
    //   success: true,
    //   message: 'Student has been successfully created',
    //   data: result,
    // });
  },
);

const createFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const faculty = req.body.faculty;
    const password = req.body.password;

    const result = await userServices.createFacultyIntoDB(password, faculty);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty has been successfully created',
      data: result,
    });
  },
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = req.body.admin;
    const password = req.body.password;

    const result = await userServices.createAdminIntoDB(password, admin);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin has been successfully created',
      data: result,
    });
  },
);

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
