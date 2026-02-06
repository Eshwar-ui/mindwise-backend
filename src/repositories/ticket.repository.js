const Ticket = require('../models/ticket.model');

class TicketRepository {
  static async createTicket(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      console.error(`[ERROR][TICKET_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getAllTickets() {
    try {
      return await Ticket.find({}).populate('userId', 'fullName email').sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error(`[ERROR][TICKET_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getTicketsByUser(userId) {
    try {
      return await Ticket.find({ userId }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error(`[ERROR][TICKET_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async getTicketById(id) {
    try {
      return await Ticket.findById(id).populate('userId', 'fullName email').lean();
    } catch (error) {
      console.error(`[ERROR][TICKET_REPOSITORY] ${error.message}`);
      throw error;
    }
  }

  static async updateTicketStatus(id, status) {
    try {
      const updates = { status };
      if (status === 'Resolved') {
        updates.resolvedAt = new Date();
      }
      return await Ticket.findByIdAndUpdate(id, updates, { new: true }).lean();
    } catch (error) {
      console.error(`[ERROR][TICKET_REPOSITORY] ${error.message}`);
      throw error;
    }
  }
}

module.exports = TicketRepository;
