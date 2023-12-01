import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Faculty Id is required'],
      ref: AcademicFacultyModel,
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicDepartmentModel.findOne({
    name: this.name,
  });

  if (isDepartmentExists) {
    throw new AppError(
      500,
      `Department with name ${this.name} already exists.`,
    );
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isDepartmentExists = await AcademicDepartmentModel.findOne(query);

  if (!isDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exist');
  }
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartments',
  academicDepartmentSchema,
);
