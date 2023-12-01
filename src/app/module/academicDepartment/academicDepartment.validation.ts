import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Department name must be string',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Department ID must be string',
      required_error: 'Department ID is required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Department name must be string',
        required_error: 'Name is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Department ID must be string',
        required_error: 'Department ID is required',
      })
      .optional(),
  }),
});

export const academicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
