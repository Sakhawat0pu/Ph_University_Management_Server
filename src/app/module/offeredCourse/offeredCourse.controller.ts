import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { offeredCourseServices } from './offeredCourse.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await offeredCourseServices.createOfferedCourseIntoDb(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course created successfully',
    data: result,
  });
});

const getAllOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await offeredCourseServices.getAllOfferedCourseFromDb(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered courses retrieved successfully',
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user.userId;
  const result =
    await offeredCourseServices.getMyOfferedCoursesFromDb(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your offered courses retrieved successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const result =
      await offeredCourseServices.getSingleOfferedCourseFromDb(courseId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course retrieved successfully',
      data: result,
    });
  },
);

const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.courseId;
  const result = await offeredCourseServices.updateOfferedCourseIntoDb(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course updated successfully',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.courseId;
  const result = await offeredCourseServices.deleteOfferedCourseFromDb(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course deleted successfully',
    data: result,
  });
});

export const offeredCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
  getMyOfferedCourses,
};
