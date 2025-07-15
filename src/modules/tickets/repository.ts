import { Insertable, Selectable } from 'kysely';
import { Database, Tickets } from '@/database';
import { keys } from './schema';

const TABLE = 'tickets';
type Row = Tickets;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: (limit = 10, offset = 0): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().limit(limit).offset(offset).execute(),

  findById: (id: number): Promise<RowSelect> =>
    db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirstOrThrow(),

  create: (record: RowInsert): Promise<RowSelect> =>
    db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirstOrThrow(),
});
