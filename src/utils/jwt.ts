import * as jwt from "jsonwebtoken";

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
