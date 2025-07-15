import type { Insertable, Selectable, Updateable } from 'kysely';
import type { Database, Screenings } from '@/database';
import { keys } from './schema';
import BadRequest from '@/utils/errors/BadRequest';

// Modal specific code
const TABLE = 'screenings';
type Row = Screenings;
type RowWithoutId = Omit<Row, 'id'>;
type RowRelationshipId = Pick<Row, 'movieId'>;
export type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
export type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().limit(limit).offset(offset).execute(),

  findById: async (id: number): Promise<RowSelect | undefined> =>
    db.selectFrom(TABLE).select(keys).where('id', '=', id).executeTakeFirst(),

  findByIds: async (ids: number[]): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().where('id', 'in', ids).execute(),

  getTicketsLeft: async (id: number): Promise<{ leftTickets: number }> =>
    db
      .selectFrom(TABLE)
      .select('leftTickets')
      .where('id', '=', id)
      .executeTakeFirstOrThrow(),

  create: async (record: RowInsert): Promise<RowSelect> => {
    await assertRelationshipExists(db, record);

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirstOrThrow();
  },

  delete: async (id: number) =>
    db.deleteFrom(TABLE).where('id', '=', id).executeTakeFirst(),

  update: async (id: number, record: RowUpdate) => {
    if (Object.keys(record).length === 0) {
      return db
        .selectFrom(TABLE)
        .select(keys)
        .where('id', '=', id)
        .executeTakeFirst();
    }

    await assertRelationshipExists(db, record);

    return db
      .updateTable(TABLE)
      .set(record)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
});

async function assertRelationshipExists(
  db: Database,
  record: Partial<RowRelationshipId>
) {
  const { movieId } = record;

  if (movieId) {
    const movie = await db
      .selectFrom('movies')
      .select('id')
      .where('id', '=', movieId)
      .executeTakeFirst();

    if (!movie) {
      throw new BadRequest('Referenced movie does not exist');
    }
  }
}
