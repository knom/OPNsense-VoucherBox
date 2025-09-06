import pino from "pino";
export const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
import { Request, Response, NextFunction } from 'express';

export function requireBody(propName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || req.body[propName] === undefined) {
            return res.status(400).json({ error: `Missing body property: ${propName}` });
        }
        next();
    };
}

export function requireParam(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.params[paramName]) {
            return res.status(400).json({ error: `${paramName} is required` });
        }
        next();
    };
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            logger.error(err);
            res.status(500).json({ error: err.message || "Internal server error" });
        });
    };
}
