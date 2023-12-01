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

export const getGeneratedId = async (payLoad: TAcademicSemester) => {
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
