import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, 'segredo');

    (req as any).usuario = decoded;

    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}