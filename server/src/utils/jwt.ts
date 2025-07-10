import jwt from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN as string;
  
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret);
};
