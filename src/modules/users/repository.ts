import { Insertable, Selectable } from 'kysely';
import { Database, Users } from '@/database';
import { keys } from './schema';

const TABLE = 'users';
type Row = Users;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: async (): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().execute(),

  findById: async (id: number): Promise<RowSelect | undefined> =>
    db.selectFrom(TABLE).select(keys).where('id', '=', id).executeTakeFirst(),

  findByIds: async (ids: number[]): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().where('id', 'in', ids).execute(),

  create: async (record: RowInsert): Promise<RowSelect> =>
    db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirstOrThrow(),
});
