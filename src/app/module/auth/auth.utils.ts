import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secretKey: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secretKey, { expiresIn });
};
