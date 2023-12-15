import { Schema, model } from 'mongoose';
import { TSemesterRegistration } from './semesterReg.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { registrationStatus } from './semesterReg.constants';

const semesterRegistrationSchema = new Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: AcademicSemesterModel,
    },
    status: {
      type: String,
      enum: registrationStatus,
      default: 'Upcoming',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);

export const SemesterRegistrationModel = model<TSemesterRegistration>(
  'Semester-registrations',
  semesterRegistrationSchema,
);
