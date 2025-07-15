import { Router, Request, Response } from 'express';
import { format } from 'date-fns';
import type { Database } from '@/database';
import { jsonRoute } from '@/utils/middleware';
import buildRepository, {
  RowSelect as ScreeningSelect,
  RowInsert as ScreeningInsert,
} from './repository';
import { parseId, parseInsertable } from './schema';
import { DATE_FORMAT } from '@/helpers/constants';

export default (db: Database) => {
  const messages = buildRepository(db);
  const router = Router();

  router
    .get(
      '/',
      jsonRoute(async (req: Request, res: Response) => {
        if (typeof req.query.id !== 'string') {
          const screenings = await messages.findAll();
          res.status(200).json(screenings);
          return;
        }

        const ids = req.query.id!.split(',').map(Number);
        ids.forEach((id) => parseId(id));
        const screenings = await messages.findByIds(ids);
        res.status(200).json(screenings);
      })
    )
    .get(
      '/:id',
      jsonRoute(async (req: Request, res: Response) => {
        const id = parseId(req.params.id);
        const screening = await messages.findById(id);
        res.status(200).json(screening);
      })
    )
    .post(
      '/',
      jsonRoute(
        async (
          req: Request<{}, {}, ScreeningInsert>,
          res: Response<ScreeningSelect>
        ) => {
          const screening = parseInsertable(req.body);
          const addedScreening = await messages.create({
            ...screening,
            timestamp: format(screening.timestamp.toISOString(), DATE_FORMAT),
          });
          res.status(201).json(addedScreening);
        }
      )
    );

  return router;
};
