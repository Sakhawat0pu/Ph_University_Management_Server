import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01][0-9]|2?[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  {
    message: 'Wrong time format, expected format HH:MM in 24-hours format',
  },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum(Days as [string])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`2023-06-20T${body.startTime}:00`);
        const end = new Date(`2023-06-20T${body.endTime}:00`);

        return start < end;
      },
      {
        message: 'Start time must be before End time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum(Days as [string])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`2023-06-20T${body.startTime}:00`);
        const end = new Date(`2023-06-20T${body.endTime}:00`);

        return start < end;
      },
      {
        message: 'Start time must be before End time',
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
