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
const studentValidationSchemaZod = z.object({
  id: z.string(),
  password: z.string().max(20),
  name: nameValidationSchema.required(),
  gender: z.enum(['male', 'female']),
  DOB: z.string(),
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
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'inactive']).default('active'),
  isDeleted: z.boolean(),
});

export default studentValidationSchemaZod;
