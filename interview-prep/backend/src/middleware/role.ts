import { Response, NextFunction } from "express";
import { AuthRequest, UserRole, ApiResponse } from "../types";

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthenticated.",
      } satisfies ApiResponse);
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to access this resource.",
      } satisfies ApiResponse);
      return;
    }

    next();
  };
};
