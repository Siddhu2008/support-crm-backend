import Ticket from '../models/Ticket.js';
import Note from '../models/Note.js';
import { generateTicketId } from '../utils/ticketId.js';

export const createTicket = async (ticketData) => {
  const ticketId = await generateTicketId(Ticket);

  const ticket = await Ticket.create({
    ...ticketData,
    ticket_id: ticketId,
  });

  return {
    ticket_id: ticket.ticket_id,
    created_at: ticket.created_at,
  };
};

export const getTickets = async ({ status, search }) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { customer_name: { $regex: search, $options: 'i' } },
      { customer_email: { $regex: search, $options: 'i' } },
      { ticket_id: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const tickets = await Ticket.find(query).sort({ created_at: -1 });
  return tickets;
};

export const getTicketById = async (ticketId) => {
  const ticket = await Ticket.findOne({ ticket_id: ticketId });

  if (!ticket) {
    return null;
  }

  const notes = await Note.find({ ticket_id: ticketId }).sort({ created_at: -1 });

  return {
    ...ticket.toObject(),
    notes: notes.map((note) => ({
      note_text: note.note_text,
      created_at: note.created_at,
    })),
  };
};

export const updateTicket = async (ticketId, updateData) => {
  const ticket = await Ticket.findOne({ ticket_id: ticketId });

  if (!ticket) {
    return null;
  }

  if (updateData.status) {
    ticket.status = updateData.status;
  }

  await ticket.save();

  if (updateData.notes) {
    await Note.create({
      ticket_id: ticketId,
      note_text: updateData.notes,
    });
  }

  return {
    success: true,
    updated_at: ticket.updated_at,
  };
};
