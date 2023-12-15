import { Types } from 'mongoose';

export type TDays = 'Sat' | 'Sun' | 'Mon' | 'Tues' | 'Wed' | 'Thurs' | 'Fri';

export type TOfferedCourses = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: Array<TDays>;
  startTime: string;
  endTime: string;
};

export type TSchedule = {
  startTime: string;
  endTime: string;
};
