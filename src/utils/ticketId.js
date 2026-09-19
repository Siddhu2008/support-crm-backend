export const generateTicketId = async (Ticket) => {
  const lastTicket = await Ticket.findOne({}, {}, { sort: { created_at: -1 } });

  if (!lastTicket) {
    return 'TKT-001';
  }

  const lastNumber = Number(lastTicket.ticket_id.replace('TKT-', '')) || 0;
  return `TKT-${String(lastNumber + 1).padStart(3, '0')}`;
};
