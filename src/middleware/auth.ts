import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // Unauthorized

  const user = verifyToken(token);
  if (!user) return res.sendStatus(403); // Forbidden

  // If authentication is successful, attach user to request object for further use
  req.user = user;
  next();
};
