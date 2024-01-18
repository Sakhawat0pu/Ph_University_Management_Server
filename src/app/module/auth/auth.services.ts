import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/users.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payLoad: TLoginUser) => {
  const user = await UserModel.isUserExists(payLoad?.id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Specified user has been deleted from the database',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Specified user has been blocked');
  }

  if (!(await UserModel.isPasswordMatched(payLoad?.password, user?.password))) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Incorrect Password, please provide the right password.',
    );
  }

  const jwtPayLoad = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayLoad,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payLoad: { oldPassword: string; newPassword: string },
) => {
  const user = await UserModel.isUserExists(userData?.userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Specified user has been deleted from the database',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Specified user has been blocked');
  }

  if (
    !(await UserModel.isPasswordMatched(payLoad?.oldPassword, user?.password))
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Incorrect Old Password, please provide the right password.',
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payLoad?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await UserModel.findOneAndUpdate(
    { id: userData?.userId, role: userData?.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { runValidators: true },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;

  const user = await UserModel.isUserExists(userId);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Specified user has been deleted from the database',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Specified user has been blocked');
  }

  if (
    user.passwordChangedAt &&
    UserModel.isJwtIssuedBeforePasswordChange(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Unauthorized user: Need to log back in',
    );
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  return { accessToken };
};

const forgetPassword = async (id: string) => {
  const user = await UserModel.isUserExists(id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Specified user has been deleted from the database',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Specified user has been blocked');
  }

  const jwtPayLoad = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayLoad,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetLink = `${config.front_end_base_uri}/reset-password?id=${id}&token=${resetToken}`;
  console.log(resetLink);
  sendEmail(user.email, resetLink);
  return null;
};

const resetPassword = async (
  payLoad: { id: string; newPassword: string },
  token: string,
) => {
  const user = await UserModel.isUserExists(payLoad?.id);
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Specified user does not exist in the database',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Specified user has been deleted from the database',
    );
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'Specified user has been blocked');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  if (decoded?.userId !== payLoad.id) {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden to reset password');
  }

  const newHashedPassword = await bcrypt.hash(
    payLoad?.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await UserModel.findOneAndUpdate(
    { id: decoded?.userId, role: decoded?.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { runValidators: true },
  );

  return null;
};

export const authServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
