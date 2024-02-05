import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { enrolledCourseServices } from './enrolledCourse.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createEnrolledCourse = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user.userId;
  const result = await enrolledCourseServices.createEnrolledCourseIntoDb(
    userId,
    data,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You successfully enrolled in this course',
    data: result,
  });
});

const updateEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    const facultyId = req.user.userId;

    const data = req.body;
    const result = await enrolledCourseServices.updateEnrolledCourseMarksIntoDb(
      facultyId,
      data,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Marks has been updated successfully',
      data: result,
    });
  },
);

const getAllEnrolledCourses = catchAsync(
  async (req: Request, res: Response) => {
    const result = await enrolledCourseServices.getAllEnrolledCoursesFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Enrolled courses have been retrieved successfully',
      data: result,
    });
  },
);

const getMyEnrolledCourses = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user.userId;
  const result = await enrolledCourseServices.getMyEnrolledCoursesFromDb(
    studentId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      'Enrolled courses for the ongoing semester have been retrieved successfully',
    meta: result?.meta,
    data: result.data,
  });
});

export const enrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getAllEnrolledCourses,
  getMyEnrolledCourses,
};
