import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = "7d"; // Token expires in 7 days

export const generateToken = (userId, username, role) => {
  const payload = {
    userId,
    username,
    role,
    iat: Math.floor(Date.now() / 1000), // Issued at time
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return token;
};

// verify JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// Extract token from Authorization header
export const extractToken = (authHeader) => {
    if(!authHeader) return null;
    const parts = authHeader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
}