import { UserRole } from './users.constants';
import { Model } from 'mongoose';

export type TUserRole = keyof typeof UserRole;

export type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface TUserModel extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean | null>;
  isJwtIssuedBeforePasswordChange(
    passwordChangedAtTimestamp: Date,
    jwtIssuedAtTimestamp: number,
  ): boolean;
}
