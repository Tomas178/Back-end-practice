import { Router, Request, Response } from 'express';
import { Database } from '@/database';
import buildRepository from './repository';
import { jsonRoute } from '@/utils/middleware';
import { parseId } from './schema';
import { ERROR_USER_NOT_FOUND } from '@/helpers/constants';

export default (db: Database) => {
  const messages = buildRepository(db);
  const router = Router();

  router
    .get(
      '/',
      jsonRoute(async (req: Request, res: Response) => {
        if (typeof req.query.id !== 'string') {
          const users = await messages.findAll();
          res.status(200).json(users);
          return;
        }

        const ids = req.query.id!.split(',').map(Number);
        ids.forEach((id) => parseId(id));
        const users = await messages.findByIds(ids);
        res.status(200).json(users);
      })
    )
    .get(
      '/:id',
      jsonRoute(async (req: Request, res: Response) => {
        const id = parseId(req.params.id);
        const user = await messages.findById(id);

        if (!user) {
          res.status(404).json({
            error: ERROR_USER_NOT_FOUND,
          });
        }

        res.status(200).json(user);
      })
    );

  return router;
};
