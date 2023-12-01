import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentIntoDb = async (payLoad: TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.create(payLoad);
  return result;
};

const getAllAcademicDepartmentFromDb = async () => {
  const result =
    await AcademicDepartmentModel.find().populate('academicFaculty');
  return result;
};

const getSingleAcademicDepartmentFromDb = async (departmentId: string) => {
  const result =
    await AcademicDepartmentModel.findById(departmentId).populate(
      'academicFaculty',
    );
  return result;
};

const updateAcademicDepartmentIntoDb = async (
  departmentId: string,
  payLoad: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: departmentId },
    payLoad,
    { new: true, runValidators: true },
  );
  return result;
};

export const academicDepartmentServices = {
  createAcademicDepartmentIntoDb,
  getAllAcademicDepartmentFromDb,
  getSingleAcademicDepartmentFromDb,
  updateAcademicDepartmentIntoDb,
};
