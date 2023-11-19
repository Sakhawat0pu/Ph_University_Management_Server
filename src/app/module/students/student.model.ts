import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

// Create Schema

const nameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true, // trims white space from the front and end of a string
    maxlength: [20, "First name can't be longer than 20 characters"],
    validate: {
      // custom validation
      validator: function (fName: string) {
        const capitalizedName =
          fName.charAt(0).toUpperCase() + fName.slice(1).toLowerCase();
        return fName === capitalizedName;
      },
      message: '{VALUE} is not in capitalized format',
    },
  },
  middleName: { type: String, maxlength: 20, trim: true },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [20, "Last name can't be longer than 20 characters"],
    validate: {
      // using validator library - checking if lName has any other character other than a-z, A-Z
      validator: (lName: string) => validator.isAlpha(lName),
      message: '{VALUE} can not have digits or special characters in it',
    },
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name field is required'],
    trim: true,
    maxlength: [20, "Name can't be longer than 20 characters"],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation field is required'],
    trim: true,
    maxlength: 30,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact no field is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother name field is required'],
    trim: true,
    maxlength: [20, "Name can't be longer than 20 characters"],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation field is required'],
    trim: true,
    maxlength: 30,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact no field is required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name field is required'],
    maxlength: [20, "Name can't be longer than 20 characters"],
  },
  occupation: {
    type: String,
    required: [true, 'Occupation field is required'],
    trim: true,
    maxlength: 30,
  },
  contactNo: { type: String, required: [true, 'Contact no field is required'] },
  address: { type: String, required: [true, 'Address field is required'] },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true },
  name: {
    type: nameSchema,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [20, "Name can't be longer than 20 characters"],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message:
        "{VALUE} is not supported. The following values are only supported: 'male', 'female'.",
    },
    required: [true, 'gender field is required.'],
  },
  DOB: { type: String },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    maxlength: 30,
    validate: {
      validator: (emailAdd: string) => validator.isEmail(emailAdd),
      message: '{VALUE} is not in valid email address format',
    },
  },
  contactNo: { type: String, required: [true, 'Contact number is required'] },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'O+', 'B-', 'AB+', 'AB-'],
      message: '{VALUE} is not supported.',
    },
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian field is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian field is required'],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message:
        "{VALUE} is not Supported. The following values are only supported: 'active','inActive'.",
    },
    default: 'active',
    required: [true, 'isActive field is required'],
  },
});

// Create Model

export const StudentModel = model<Student>('Student', studentSchema); // Here 'Student' is the collection name
