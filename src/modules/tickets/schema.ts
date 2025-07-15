import { z } from 'zod';
import { Tickets } from '@/database';

type Record = Tickets;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  screeningId: z.coerce.number().int().positive(),
  createdAt: z.coerce.date(),
});

const insertable = schema.omit({ id: true, createdAt: true });

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: number) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
