import Joi from 'joi';

// Joi schema for name field
const nameValidationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]+$/),
  middleName: Joi.string()
    .max(20)
    .trim()
    .pattern(/^[A-Z][a-z]+$/),
  lastName: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]+$/),
});

// Joi schema for guardian field
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/),
  fatherOccupation: Joi.string().required().trim().max(30),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/),
  motherOccupation: Joi.string().required().trim().max(30),
  motherContactNo: Joi.string().required(),
});

// Joi schema for localGuardian field
const localGuardianValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .max(20)
    .pattern(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/),
  occupation: Joi.string().required().trim().max(30),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

// Joi schema for student model
const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  name: nameValidationSchema.required(),
  gender: Joi.string().valid('male', 'female').required(),
  DOB: Joi.string(),
  email: Joi.string().required().trim().email(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'B-',
    'AB+',
    'AB-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .required(),
});

export default studentValidationSchema;
