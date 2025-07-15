import { Router } from 'express';
import { Database } from '@/database';
import buildTicketsRepository from './repository';
import buildScreeningsRepository from '@/modules/screenings/repository';
import { jsonRoute } from '@/utils/middleware';
import { parseInsertable } from './schema';
import { ERROR_NO_TICKETS_LEFT } from '@/helpers/constants';

export default (db: Database) => {
  const ticketsRepo = buildTicketsRepository(db);
  const screeningsRepo = buildScreeningsRepository(db);
  const router = Router();

  router
    .get(
      '/',
      jsonRoute(async (req, res) => {
        const tickets = await ticketsRepo.findAll();
        res.status(200).json(tickets);
      })
    )
    .post(
      '/',
      jsonRoute(async (req, res) => {
        const ticket = parseInsertable(req.body);
        const { leftTickets } = await screeningsRepo.getTicketsLeft(
          ticket.screeningId
        );
        if (leftTickets <= 0) {
          res.status(400).json({ error: ERROR_NO_TICKETS_LEFT });
          return;
        }
        const addedTicket = await ticketsRepo.create(ticket);
        res.status(201).json(addedTicket);
      })
    );

  return router;
};
