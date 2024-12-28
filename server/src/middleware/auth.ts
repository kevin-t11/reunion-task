import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied, token missing" });
    return;
  }

  try {
    // Verify the JWT token and decode its payload
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: (error as Error).message,
    });
  }
};
