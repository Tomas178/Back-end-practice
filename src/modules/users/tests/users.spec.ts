import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import supertest from 'supertest';
import createApp from '@/app';
import { USERS } from './utils/repository';
import { ERROR_USER_NOT_FOUND } from '@/helpers/constants';

const db = await createTestDatabase();
const app = createApp(db);
const createUsers = createFor(db, 'users');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('GET', () => {
  beforeEach(async () => {
    await createUsers(USERS);
  });

  it('Returns all the users', async () => {
    const { body } = await supertest(app).get('/users').expect(200);
    expect(body).toHaveLength(USERS.length);
    expect(body).toEqual(USERS);
  });

  it('Returns user by id', async () => {
    const { body } = await supertest(app).get(`/users/${USERS[0].id}`);
    expect(body).toEqual(USERS[0]);
  });

  it('Returns users by IDs provided in query', async () => {
    const { body } = await supertest(app)
      .get(`/users?id=${USERS[0].id},${USERS[1].id}`)
      .expect(200);

    expect(body).toHaveLength(2);
    expect(body).toEqual([USERS[0], USERS[1]]);
  });

  it('Should return an error that user was not found', async () => {
    const invalidId = Math.max(...USERS.map((user) => user.id)) + 1;
    const { body } = await supertest(app)
      .get(`/users/${invalidId}`)
      .expect(404);
    expect(body).toEqual({ error: ERROR_USER_NOT_FOUND });
  });
});
