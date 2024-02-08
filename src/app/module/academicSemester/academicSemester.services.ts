import { Types } from 'mongoose';
import { SemesterNameCodeMapper } from './academicSemester.constants';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../builder/QueryBuilder';

const createAcademicSemesterIntoDb = async (payLoad: TAcademicSemester) => {
  if (SemesterNameCodeMapper[payLoad.name] !== payLoad.code) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Invalid semester code. Code for ${payLoad.name} semester is ${
        SemesterNameCodeMapper[payLoad.name]
      }`,
    );
  }

  const result = await AcademicSemesterModel.create(payLoad);
  return result;
};

const getAcademicSemestersFromDb = async (query: Record<string, unknown>) => {
  const semesterQuery = new QueryBuilder(AcademicSemesterModel.find(), query)
    .filter()
    .paginate()
    .sort()
    .selectFields();
  const semesters = await semesterQuery.modelQuery;
  const meta = await semesterQuery.countTotal();
  return { meta, semesters };
};

const getSingleAcademicSemesterFromDb = async (id: string) => {
  const query = { _id: new Types.ObjectId(id) };
  const result = await AcademicSemesterModel.findOne(query);
  return result;
};

const updateAcademicSemesterIntoDb = async (
  id: string,
  updatedSemester: Partial<TAcademicSemester>,
) => {
  const filter = { _id: new Types.ObjectId(id) };
  if (!(await AcademicSemesterModel.findOne(filter))) {
    throw new AppError(httpStatus.NOT_FOUND, `Semester with ${id} not found`);
  }
  const result = await AcademicSemesterModel.findOneAndUpdate(
    filter,
    updatedSemester,
    { new: true, runValidators: true },
  );
  return result;
};

export const academicSemesterServices = {
  createAcademicSemesterIntoDb,
  getAcademicSemestersFromDb,
  getSingleAcademicSemesterFromDb,
  updateAcademicSemesterIntoDb,
};
