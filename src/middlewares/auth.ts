import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokens';

interface CustomRequest extends Request {
  user?: any;
}

export function auth(req: CustomRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      console.log(req.user);
      next();
    } catch (err) {
      res.status(401).send({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}