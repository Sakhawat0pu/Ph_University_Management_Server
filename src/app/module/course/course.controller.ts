import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { courseServices } from './course.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await courseServices.createCourseIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await courseServices.getAllCoursesFromDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await courseServices.getSingleCourseFromDb(
    req.params.courseId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses is retrieved successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await courseServices.deleteCourseFromDb(req.params.courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await courseServices.updateCourseIntoDb(
    req.params.courseId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated successfully',
    data: result,
  });
});

const assignFacultyToCourse = catchAsync(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const result = await courseServices.assignFacultyToCourseIntoDb(
      courseId,
      req.body.faculties,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties are assigned successfully',
      data: result,
    });
  },
);

const removeFacultyFromCourse = catchAsync(
  async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const result = await courseServices.removeFacultyFromCourseFromDb(
      courseId,
      req.body.faculties,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties are deleted successfully',
      data: result,
    });
  },
);

const getFacultiesForACourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await courseServices.getFacultiesForACourseFromDb(
      req.params.courseId,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Course Faculties are retrieved successfully',
      data: result,
    });
  },
);

export const courseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  getFacultiesForACourse,
  deleteCourse,
  updateCourse,
  assignFacultyToCourse,
  removeFacultyFromCourse,
};
