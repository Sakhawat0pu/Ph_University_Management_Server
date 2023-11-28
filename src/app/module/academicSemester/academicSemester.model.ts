import { Schema, UpdateQuery, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
  SemesterNameCodeMapper,
} from './academicSemester.constants';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterName,
      required: [true, 'Name field is required'],
    },
    code: {
      type: String,
      enum: AcademicSemesterCode,
      required: [true, 'Code is required'],
    },
    year: { type: String, required: [true, 'Year field is required'] },
    startMonth: {
      type: String,
      enum: Months,
      required: [true, 'Start month value is required'],
    },
    endMonth: {
      type: String,
      enum: Months,
      required: [true, 'End month value is required'],
    },
  },
  {
    timestamps: true,
  },
);

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExists) {
    throw new Error('Semester already exists');
  }
  next();
});

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate()! as UpdateQuery<TAcademicSemester>;

  if (update.name && update.year) {
    const isSemesterExists = await AcademicSemesterModel.findOne({
      name: update.name,
      year: update.year,
    });
    if (isSemesterExists) {
      throw new Error('Semester already exists');
    }
  }

  if (update.name && update.code) {
    if (SemesterNameCodeMapper[update.name] !== update.code) {
      throw new Error(
        `Invalid semester code. Code for ${update.name} semester is ${
          SemesterNameCodeMapper[update.name]
        }`,
      );
    }
  }
  next();
});

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemesters',
  academicSemesterSchema,
);
