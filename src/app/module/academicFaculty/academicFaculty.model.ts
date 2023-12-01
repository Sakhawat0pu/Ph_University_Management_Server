import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.pre('save', async function (next) {
  const isFacultyExists = await AcademicFacultyModel.findOne({
    name: this.name,
  });

  if (isFacultyExists) {
    throw new AppError(500, `Faculty with name ${this.name} already exists.`);
  }
  next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();

  const isFacultyExists = await AcademicFacultyModel.findOne(query);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty does not exist');
  }
  next();
});

export const AcademicFacultyModel = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);
