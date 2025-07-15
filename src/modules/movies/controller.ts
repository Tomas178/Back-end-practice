import { Router } from 'express';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRespository from './repository';
import { parseInsertable } from './schema';

export default (db: Database) => {
  const messages = buildRespository(db);
  const router = Router();

  router
    .get(
      '/',
      jsonRoute(async (req, res) => {
        if (typeof req.query.id !== 'string') {
          const movies = await messages.findAll();
          res.status(200).json(movies);
          return;
        }

        // a hard-coded solution for your first controller test
        const ids = req.query.id!.split(',').map(Number);
        const movies = await messages.findByIds(ids);

        res.status(200).json(movies);
      })
    )
    .post(
      '/',
      jsonRoute(async (req, res) => {
        const movie = parseInsertable(req.body);
        const addedMovie = await messages.create(movie);
        res.status(201).json(addedMovie);
      })
    );

  return router;
};
