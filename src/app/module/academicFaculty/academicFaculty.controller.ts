import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { academicFacultyServices } from './academicFaculty.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const academicFaculty = req.body;
    const result =
      await academicFacultyServices.createAcademicFacultyIntoDb(
        academicFaculty,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is created successfully',
      data: result,
    });
  },
);

const getAllAcademicFaculties = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await academicFacultyServices.getAllAcademicFacultiesFromDb();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Academic Faculties are retrieved successfully',
      data: result,
    });
  },
);

const getSingleAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const facultyId = req.params.facultyId;
    const result =
      await academicFacultyServices.getSingleAcademicFacultyFromDb(facultyId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is retrieved successfully',
      data: result,
    });
  },
);

const updateAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const facultyId = req.params.facultyId;
    const academicFaculty = req.body;
    const result = await academicFacultyServices.updateAcademicFacultyIntoDb(
      facultyId,
      academicFaculty,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty is updated successfully',
      data: result,
    });
  },
);

export const academicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
