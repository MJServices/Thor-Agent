import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as unknown as number };
  return jwt.sign(payload, JWT_SECRET!, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const getUserFromToken = async (token: string): Promise<IUser | null> => {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
};