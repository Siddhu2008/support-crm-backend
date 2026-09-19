import { z } from 'zod';

export const createTicketSchema = z.object({
  customer_name: z.string().trim().min(2, 'Customer name is required'),
  customer_email: z.string().trim().email('Invalid customer email'),
  subject: z.string().trim().min(3, 'Subject is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
});

export const updateTicketSchema = z.object({
  status: z.enum(['Open', 'In Progress', 'Closed'], {
    errorMap: () => ({ message: 'Invalid ticket status' }),
  }).optional(),
  notes: z.string().trim().min(1, 'Note cannot be empty').optional(),
});
