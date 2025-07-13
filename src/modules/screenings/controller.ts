import { Router, Request, Response } from 'express';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository from './repository';

export default (db: Database) => {
  const messages = buildRepository(db);
  const router = Router();

  router.get(
    '/',
    jsonRoute(async (req: Request, res: Response) => {
      if (typeof req.query.id !== 'string') {
        const screenings = await messages.findAll();
        res.status(200).json(screenings);
        return;
      }

      const ids = req.query.id!.split(',').map(Number);
      const screenings = await messages.findByIds(ids);
      res.status(200).json(screenings);
    })
  );

  return router;
};
