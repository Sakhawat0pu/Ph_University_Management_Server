import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import config from '../config';
import { TUserRole } from '../module/users/users.interface';
import { UserModel } from '../module/users/users.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { userId, role, iat } = decoded;

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
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Specified user has been blocked',
      );
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

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized user');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
