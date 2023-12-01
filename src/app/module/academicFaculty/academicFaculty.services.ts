import { Types } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyIntoDb = async (payLoad: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payLoad);
  return result;
};

const getAllAcademicFacultiesFromDb = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const getSingleAcademicFacultyFromDb = async (id: string) => {
  const result = await AcademicFacultyModel.findById(id);
  return result;
};

const updateAcademicFacultyIntoDb = async (
  id: string,
  payLoad: Partial<TAcademicFaculty>,
) => {
  const filter = { _id: new Types.ObjectId(id) };
  const result = await AcademicFacultyModel.findOneAndUpdate(filter, payLoad, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const academicFacultyServices = {
  createAcademicFacultyIntoDb,
  getAllAcademicFacultiesFromDb,
  getSingleAcademicFacultyFromDb,
  updateAcademicFacultyIntoDb,
};
