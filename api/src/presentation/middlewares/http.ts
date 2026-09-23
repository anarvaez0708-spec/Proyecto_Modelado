import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { GetUserFromToken } from '../../domain/usecases/usecases.js';
import type { AuthService } from '../../domain/repositories/repositories.js';
export type AuthRequest = Request & { currentUser?: { id_usuario: number; roles?: string[] } };
export const authMiddleware = (auth: AuthService) => async (req: AuthRequest, res: Response, next: NextFunction) => { try { const header = req.headers.authorization; if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' }); req.currentUser = await new GetUserFromToken(auth).execute(header.slice(7)); next(); } catch (error) { next(Object.assign(new Error(error instanceof Error ? error.message : 'No autorizado'), { status: 401 })); } };
export const requireRoles = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => { if (!req.currentUser?.roles?.some((role) => roles.includes(role))) return res.status(403).json({ error: 'Rol insuficiente' }); next(); };
export const body = <T extends z.ZodType>(schema: T) => (req: Request, res: Response, next: NextFunction) => { const result = schema.safeParse(req.body); if (!result.success) return res.status(400).json({ error: 'Datos inválidos', details: result.error.flatten() }); req.body = result.data; next(); };
export const errorHandler = (error: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => res.status(error.status ?? 500).json({ error: error.message || 'Error interno' });