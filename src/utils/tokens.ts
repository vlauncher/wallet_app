import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export function generateAccessToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}