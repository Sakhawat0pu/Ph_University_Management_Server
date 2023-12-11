import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './users.model';

const getLastUserId = async () => {
  const lastUser = await UserModel.findOne(
    { role: 'student' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastUser?.id ? lastUser?.id : undefined;
};

export const generateStudentId = async (payLoad: TAcademicSemester) => {
  let currentID = (0).toString();
  const lastID = await getLastUserId();
  const lastStudentYear = lastID?.substring(0, 4);
  const lastStudentCode = lastID?.substring(4, 6);

  if (
    lastID &&
    lastStudentCode === payLoad.code &&
    lastStudentYear === payLoad.year
  ) {
    currentID = lastID.substring(6);
  }

  let generatedId = (Number(currentID) + 1).toString().padStart(4, '0');
  generatedId = `${payLoad.year}${payLoad.code}${generatedId}`;
  return generatedId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await UserModel.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};
