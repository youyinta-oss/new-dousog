import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiResponse } from '../types';
import { logger } from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      code: 401,
      message: '未提供认证令牌',
    } as ApiResponse);
    return;
  }

  const token = authHeader.slice(7);

  try {
    jwt.verify(token, config.apiSecretKey);
    next();
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: '令牌无效或已过期',
    } as ApiResponse);
  }
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`API 错误: ${err.message}`, { path: req.path, method: req.method });
  res.status(500).json({
    code: 500,
    message: err.message || '服务器内部错误',
  } as ApiResponse);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.debug(`${req.method} ${req.path}`);
  next();
};

/**
 * 生成 JWT Token
 */
export function generateToken(expiresInDays: number = 7): string {
  return jwt.sign(
    { timestamp: Date.now() },
    config.apiSecretKey,
    { expiresIn: `${expiresInDays}d` }
  );
}