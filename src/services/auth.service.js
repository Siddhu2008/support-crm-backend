import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  return { user: formatUser(user), token: createToken(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  const isValid = user && await bcrypt.compare(password, user.password);

  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return { user: formatUser(user), token: createToken(user) };
};