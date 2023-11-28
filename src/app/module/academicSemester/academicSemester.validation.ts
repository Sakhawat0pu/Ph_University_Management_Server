import { z } from 'zod';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from './academicSemester.constants';
import { TAcademicSemesterName } from './academicSemester.interface';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum(AcademicSemesterName as [string]),
    code: z.enum(AcademicSemesterCode as [string]),
    year: z.string(),
    startMonth: z.enum(Months as [string]),
    endMonth: z.enum(Months as [string]),
  }),
});

export const academicSemesterValidations = {
  createAcademicSemesterValidationSchema,
};
