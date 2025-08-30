import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthedRequest extends Request {
    user? : { id: string; email : string; name: string}; 
}
export function authRequired(req: AuthedRequest, res: Response, next: NextFunction) {

  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {

    return res.status(401).json(

        { error: "Missing token" }

    );
  }
  const token = header.split(" ")[1];

  try {

    const payload = jwt.verify(token, config.jwtSecret) as any;

    req.user = { id: payload.id, email: payload.email, name: payload.name };
    
    return next();

  } catch {

    return res.status(401).json(
        { error: "Invalid or expired token" }
    );
  }
}