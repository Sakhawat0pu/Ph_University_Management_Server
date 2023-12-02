import { z } from 'zod';

// Zod schema for name field
const nameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*$/.test(data), {
      message:
        'First name must start with an uppercase letter followed by lowercase letters',
    }),
  middleName: z.string().max(20).optional(),
  lastName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*$/.test(data), {
      message:
        'Last name must start with an uppercase letter followed by lowercase letters',
    }),
});

// Zod schema for guardian field
const guardianValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message: 'Father name must follow the specified format',
    }),
  fatherOccupation: z.string().max(30),
  fatherContactNo: z.string(),
  motherName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message:
        'Mother name must start with an uppercase letter followed by lowercase letters',
    }),
  motherOccupation: z.string().max(30),
  motherContactNo: z.string(),
});

// Zod schema for localGuardian field
const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message:
        'Local guardian name must start with an uppercase letter followed by lowercase letters',
    }),
  occupation: z.string().max(30),
  contactNo: z.string(),
  address: z.string(),
});

// Zod schema for student model
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: nameValidationSchema.required(),
      gender: z.enum(['male', 'female']),
      DOB: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'B-', 'AB+', 'AB-'])
        .optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema.required(),
      localGuardian: localGuardianValidationSchema.required(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      profileImg: z.string().optional(),
    }),
  }),
});

const updateNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*$/.test(data), {
      message:
        'First name must start with an uppercase letter followed by lowercase letters',
    })
    .optional(),
  middleName: z.string().max(20).optional(),
  lastName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*$/.test(data), {
      message:
        'Last name must start with an uppercase letter followed by lowercase letters',
    })
    .optional(),
});

// Zod schema for guardian field
const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message: 'Father name must follow the specified format',
    })
    .optional(),
  fatherOccupation: z.string().max(30).optional(),
  fatherContactNo: z.string().optional(),
  motherName: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message:
        'Mother name must start with an uppercase letter followed by lowercase letters',
    })
    .optional(),
  motherOccupation: z.string().max(30).optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(20)
    .refine((data) => /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(data), {
      message:
        'Local guardian name must start with an uppercase letter followed by lowercase letters',
    })
    .optional(),
  occupation: z.string().max(30).optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      gender: z.enum(['male', 'female']).optional(),
      DOB: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'B-', 'AB+', 'AB-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.required().optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
