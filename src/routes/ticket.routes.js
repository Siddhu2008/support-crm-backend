import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
} from '../controllers/ticket.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', requireAuth, createTicket);
router.get('/', requireAuth, getTickets);
router.get('/:ticketId', requireAuth, getTicketById);
router.put('/:ticketId', requireAuth, requireRole('agent', 'admin'), updateTicket);

export default router;
