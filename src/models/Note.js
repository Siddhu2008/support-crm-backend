import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      trim: true,
      ref: 'Ticket',
    },
    note_text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  }
);

export default mongoose.model('Note', noteSchema);
