import { z } from 'zod';
import type { Screenings } from '@/database';

type Record = Screenings;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  movieId: z.coerce.number().int().positive(),
  totalTickets: z.coerce.number().int().positive(),
  leftTickets: z.coerce.number().int().nonnegative(),
  timestamp: z.coerce.date(),
  createdAt: z.coerce.date(),
});

const insertable = schema.omit({
  id: true,
  createdAt: true,
});

const updateable = schema
  .omit({
    id: true,
    movieId: true,
    totalTickets: true,
    leftTickets: true,
    timestamp: true,
    createdAt: true,
  })
  .partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
