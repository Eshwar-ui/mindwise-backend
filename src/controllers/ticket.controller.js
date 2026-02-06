const TicketRepository = require('../repositories/ticket.repository');

class TicketController {
  static async create(req, res) {
    try {
      const { category, subject, description, priority } = req.body;
      const userId = req.user.id;
      
      // Validation with helpful messages
      if (!subject || !description) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'Please provide both a subject and description for your ticket.'
        });
      }
      
      if (subject.trim().length < 5) {
        return res.status(400).json({ 
          error: 'Subject too short',
          message: 'Please provide a more descriptive subject (at least 5 characters).'
        });
      }
      
      if (description.trim().length < 10) {
        return res.status(400).json({ 
          error: 'Description too short',
          message: 'Please provide more details about your issue (at least 10 characters).'
        });
      }
      
      const ticket = await TicketRepository.createTicket({ 
        userId, 
        category, 
        subject: subject.trim(), 
        description: description.trim(), 
        priority 
      });

      res.status(201).json(ticket);
    } catch (error) {
      console.error(`[ERROR][TICKET_CONTROLLER] ${error.message}`);
      res.status(400).json({ 
        error: 'Unable to create ticket',
        message: 'Failed to create your support ticket. Please try again.'
      });
    }
  }

  static async getUserTickets(req, res) {
    try {
      const tickets = await TicketRepository.getTicketsByUser(req.user.id);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ 
        error: 'Unable to fetch tickets',
        message: 'Failed to retrieve your support tickets. Please try again.'
      });
    }
  }

  static async getTicketById(req, res) {
    try {
      const ticket = await TicketRepository.getTicketById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ 
          error: 'Ticket not found',
          message: 'The requested ticket could not be found. It may have been deleted.'
        });
      }
      
      // Ensure user owns the ticket or is admin
      if (ticket.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permission to view this ticket.'
        });
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ 
        error: 'Unable to fetch ticket',
        message: 'Failed to retrieve the ticket details. Please try again.'
      });
    }
  }
}

module.exports = TicketController;
