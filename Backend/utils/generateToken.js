import jwt from 'jsonwebtoken';

export const generateToken = (id, role = null, expiresIn = '1d') => {
  const payload = { id };
  if (role) {
    payload.role = role;
  }
  
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
};
