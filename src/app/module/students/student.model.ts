import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  // TStudentMethods,
  TStudentModel,
  UserName,
} from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { boolean } from 'joi';

// Create Schema

const userNameSchema = new Schema<UserName>({
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

// const studentSchema = new Schema<Student, TStudentModel, TStudentMethods>({  // when using method
const studentSchema = new Schema<Student, TStudentModel>(
  {
    id: { type: String, required: true, unique: true },
    // password: {
    //   type: String,
    //   required: true,
    //   maxlength: [20, "Password can't be longer than 20 characters"],
    // },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      unique: true,
      ref: 'UserModel', // referencing user model
    },
    name: {
      type: userNameSchema,
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
    // isActive: {
    //   type: String,
    //   enum: {
    //     values: ['active', 'inactive'],
    //     message:
    //       "{VALUE} is not Supported. The following values are only supported: 'active','inActive'.",
    //   },
    //   default: 'active',
    //   required: [true, 'isActive field is required'],
    // },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtuals - used to create a virtual field which physically does not exist in the database but
// it value is constructed from the value of existing field in the database
// this refers to the current document
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName ?? ''} ${
    this.name.lastName
  }`;
});

// Pre 'save' middleware/hook : works on save()/create()

/* studentSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
}); */

// post 'save' middleware/hook    -- Document middleware - here this refer to current document
/* studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
}); */

// Query middleware - this.find()  refers to current find() query

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } }); // A query chaining will be created, this query will be executed
  // then the query coming from client side will be executed
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Aggregate middleware

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } }); // this.pipeline() returns the current
  // pipeline of aggregate function
  next();
});

/*
** Using methods

studentSchema.methods.isUserExists = async (id: string) => {
  return await StudentModel.findOne({ id });
};
*/

// Using Statics

studentSchema.statics.isUserExists = async (id: string) => {
  return await StudentModel.findOne({ id });
};

// Create Model

export const StudentModel = model<Student, TStudentModel>(
  'Student',
  studentSchema,
); // Here 'Student' is the collection name
