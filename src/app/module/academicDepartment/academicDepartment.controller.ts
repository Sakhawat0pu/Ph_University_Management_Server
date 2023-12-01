import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { academicDepartmentServices } from './academicDepartment.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const academicDepartment = req.body;
    const result =
      await academicDepartmentServices.createAcademicDepartmentIntoDb(
        academicDepartment,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is created successfully',
      data: result,
    });
  },
);

const getAllAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await academicDepartmentServices.getAllAcademicDepartmentFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Departments are retrieved successfully',
      data: result,
    });
  },
);

const getSingleAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;
    const result =
      await academicDepartmentServices.getSingleAcademicDepartmentFromDb(
        departmentId,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is retrieved successfully',
      data: result,
    });
  },
);

const updateAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;
    const academicDepartment = req.body;

    const result =
      await academicDepartmentServices.updateAcademicDepartmentIntoDb(
        departmentId,
        academicDepartment,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is updated successfully',
      data: result,
    });
  },
);

export const academicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
