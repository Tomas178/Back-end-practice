import { Kysely, sql, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('screenings')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('movie_id', 'integer', (c) =>
      c.references('movies.id').notNull()
    )
    .addColumn('total_tickets', 'integer', (c) => c.notNull())
    .addColumn('left_tickets', 'integer', (c) => c.notNull())
    .addColumn('timestamp', 'datetime', (c) => c.notNull())
    .addColumn('created_at', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('screenings').execute();
}
