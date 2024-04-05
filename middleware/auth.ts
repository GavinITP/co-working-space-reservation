import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { UserType } from "../types";

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    if (!decodedToken)
      return res.status(400).json({ message: "Invalid token" });

    const user = await User.findById(decodedToken.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${
          req.user?.role || "undefined"
        } is not authorized to access this route`,
      });
    }

    next();
  };
};

export { protect, authorize };
