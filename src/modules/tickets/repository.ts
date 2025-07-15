import { Insertable, Selectable } from 'kysely';
import { Database, Tickets } from '@/database';
import { keys } from './schema';
import BadRequest from '@/utils/errors/BadRequest';

const TABLE = 'tickets';
type Row = Tickets;
type RowWithoutId = Omit<Row, 'id'>;
type RowRelationshipIds = Pick<Row, 'userId' | 'screeningId'>;
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

  create: async (record: RowInsert): Promise<RowSelect> => {
    await assertRelationshipsExist(db, record);
    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirstOrThrow();
  },
});

async function assertRelationshipsExist(
  db: Database,
  record: Partial<RowRelationshipIds>
) {
  const { userId, screeningId } = record;

  // we would perform both checks in a single Promise.all
  if (userId) {
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new BadRequest('Referenced user does not exist');
    }
  }

  if (screeningId) {
    const screening = await db
      .selectFrom('screenings')
      .select('id')
      .where('id', '=', screeningId)
      .executeTakeFirst();

    if (!screening) {
      throw new BadRequest('Referenced screening does not exist');
    }
  }
}
