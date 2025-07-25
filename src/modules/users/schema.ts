import { z } from 'zod';
import type { Users } from '@/database';

type Record = Users;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  username: z.string().max(32),
  createdAt: z.coerce.date(),
});

const insertable = schema.omit({ id: true });

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
