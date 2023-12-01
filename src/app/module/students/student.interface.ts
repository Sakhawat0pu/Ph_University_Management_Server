import { Model, Types } from 'mongoose';

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type Guardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type LocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type Student = {
  id: string;
  user: Types.ObjectId;
  // password: string;
  name: UserName;
  gender: 'male' | 'female';
  DOB?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  localGuardian: LocalGuardian;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  profileImg?: string;
  // isActive: 'active' | 'inactive';
  isDeleted: boolean;
};

// Using statics

export interface TStudentModel extends Model<Student> {
  isUserExists(id: string): Promise<Student | null>;
}

/*  
** Using method
export type TStudentMethods = {
  isUserExists(id: string): Promise<Student | null>;
};

export type TStudentModel = Model<
  Student,
  Record<string, never>,
  TStudentMethods
>;
*/
