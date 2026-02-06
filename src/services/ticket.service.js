/**
 * Ticket Service
 * Reference: Rule 168, 170, 227
 * 
 * Manages support ticket persistence.
 */

const Ticket = require('../models/ticket.model');
const TicketRepository = require('../repositories/ticket.repository');

class TicketService {
  static async create(ticketData) {
    Ticket.validate(ticketData); // Rule 195 validation
    
    const newTicket = await TicketRepository.createTicket(ticketData);
    
    // Rule 257, 259: Log ticket creation event without PII
    console.log(`[LOG][TICKET_CREATED] ID: ${newTicket._id} Status: ${newTicket.status}`);
    
    return newTicket;
  }
}

module.exports = TicketService;
