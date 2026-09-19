import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
} from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:ticketId', getTicketById);
router.put('/:ticketId', updateTicket);

export default router;
