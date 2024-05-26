// src/types/express-request.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    uid: string;
  };
}
