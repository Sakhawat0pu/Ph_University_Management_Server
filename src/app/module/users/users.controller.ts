import { NextFunction, Request, Response } from 'express';
import { userServices } from './users.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const student = req.body.student; // res.body returns an object of form {student: {id: ,name: ,.....}}
    const password = req.body.password;
    const imgFile = req.file;

    const result = await userServices.createStudentIntoDb(
      student,
      password,
      imgFile,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student has been successfully created',
      data: result,
    });
  },
);

const createFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const faculty = req.body.faculty;
    const password = req.body.password;
    const imgFile = req.file;
    const result = await userServices.createFacultyIntoDB(
      password,
      faculty,
      imgFile,
    );

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
    const imgFile = req.file;
    const result = await userServices.createAdminIntoDB(
      password,
      admin,
      imgFile,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin has been successfully created',
      data: result,
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, role } = req?.user;

    const result = await userServices.getMeFromDb(userId, role);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User has been retrieved successfully ',
      data: result,
    });
  },
);

const changeStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const userData = req.body;
    const result = await userServices.changeStatusIntoDb(userId, userData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User status has been changed successfully ',
      data: result,
    });
  },
);

export const userControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
