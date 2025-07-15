import { SqliteDatabase, Kysely, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('username', 'text', (c) => c.notNull())
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable('tickets')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('user_id', 'integer', (c) => c.notNull().references('users.id'))
    .addColumn('screening_id', 'integer', (c) =>
      c.notNull().references('screenings.id')
    )
    .addColumn('createdAt', 'datetime', (c) =>
      c.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('tickets').execute();
  await db.schema.dropTable('users').execute();
}
