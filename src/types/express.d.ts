import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email?: string;
    };
  }
}
