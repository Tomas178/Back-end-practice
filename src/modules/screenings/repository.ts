import type { Database } from '@/database';

const TABLE_NAME = 'screenings';

export default (db: Database) => ({
  findAll: async (limit = 10, offset = 0) =>
    db.selectFrom(TABLE_NAME).selectAll().limit(limit).offset(offset).execute(),

  findByIds: async (ids: number[]) =>
    db.selectFrom(TABLE_NAME).selectAll().where('id', 'in', ids).execute(),
});
