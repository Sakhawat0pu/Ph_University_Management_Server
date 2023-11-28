import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { academicSemesterServices } from './academicSemester.services';

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
  const result = await academicSemesterServices.getAcademicSemestersFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semesters have been retrieved successfully',
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const semesterId = req.params.semesterId;
  const result =
    await academicSemesterServices.getSingleAcademicSemesterFromDb(semesterId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester has been retrieved successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const semesterId = req.params.semesterId;
  const updatedDoc = req.body;
  if (updatedDoc.name || updatedDoc.year || updatedDoc.code) {
    if (!updatedDoc.name || !updatedDoc.year || !updatedDoc.code) {
      throw new Error('Must include name, year, code');
    }
  }
  const result = await academicSemesterServices.updateAcademicSemesterIntoDb(
    semesterId,
    updatedDoc,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester has been updated successfully',
    data: result,
  });
});

export const academicSemesterController = {
  createAcademicSemester,
  getAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
