import { createTicketSchema, updateTicketSchema } from '../validators/ticket.validator.js';
import * as ticketService from '../services/ticket.service.js';

export const createTicket = async (req, res, next) => {
  try {
    const parsed = createTicketSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid request',
      });
    }

    const result = await ticketService.createTicket(parsed.data);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const tickets = await ticketService.getTickets({
      status: status || '',
      search: search || '',
    });

    return res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const parsed = updateTicketSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid request',
      });
    }

    const result = await ticketService.updateTicket(req.params.ticketId, parsed.data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};
