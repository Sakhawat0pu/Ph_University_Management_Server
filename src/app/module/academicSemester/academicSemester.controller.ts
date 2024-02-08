import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.services';
import AppError from '../../errors/AppError';

const createAcademicSemester = catchAsync(async (req, res) => {
  const data = await academicSemesterServices.createAcademicSemesterIntoDb(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester created successfully',
    data: data,
  });
});

const getAcademicSemesters = catchAsync(async (req, res) => {
  const result = await academicSemesterServices.getAcademicSemestersFromDb(
    req?.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters are retrieved successfully',
    meta: result.meta,
    data: result.semesters,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const semesterId = req.params.semesterId;
  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDb(semesterId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is retrieved successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const semesterId = req.params.semesterId;
  const updatedDoc = req.body;
  if (updatedDoc.name || updatedDoc.year || updatedDoc.code) {
    if (!updatedDoc.name || !updatedDoc.year || !updatedDoc.code) {
      throw new AppError(500, 'Must include name, year, code');
    }
  }
  const result = await academicSemesterServices.updateAcademicSemesterIntoDb(
    semesterId,
    updatedDoc,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is updated successfully',
    data: result,
  });
});

export const academicSemesterController = {
  createAcademicSemester,
  getAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
