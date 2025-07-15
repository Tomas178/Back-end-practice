import { Insertable, Selectable, Updateable } from 'kysely';
import type { Database, Movies } from '@/database';
import { keys } from './schema';

const TABLE = 'movies';
type Row = Movies;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db.selectFrom(TABLE).selectAll().limit(limit).offset(offset).execute(),

  findByIds: async (ids: number[]) =>
    db.selectFrom(TABLE).selectAll().where('id', 'in', ids).execute(),

  findById: async (id: number): Promise<RowSelect | undefined> =>
    db.selectFrom(TABLE).select(keys).where('id', '=', id).executeTakeFirst(),

  create: async (record: RowInsert): Promise<RowSelect> =>
    db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirstOrThrow(),
});
