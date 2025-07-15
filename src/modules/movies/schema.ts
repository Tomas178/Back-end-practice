import { z } from 'zod';
import type { Movies } from '@/database';

type Record = Movies;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().max(64),
  year: z.coerce.number().int().positive(),
});

const insertable = schema.omit({ id: true });

const updateable = schema
  .omit({
    id: true,
    title: true,
    year: true,
  })
  .partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
