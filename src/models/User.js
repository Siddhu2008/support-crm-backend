import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['agent', 'admin'], default: 'agent' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);