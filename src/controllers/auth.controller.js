import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import * as authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid request' });
    }

    const result = await authService.registerUser(parsed.data);
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.issues[0]?.message || 'Invalid request' });
    }

    const result = await authService.loginUser(parsed.data);
    return res.json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};