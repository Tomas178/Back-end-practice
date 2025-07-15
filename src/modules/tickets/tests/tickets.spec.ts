import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import supertest from 'supertest';
import createApp from '@/app';
import {
  MOVIES,
  SCREENING_WITH_NO_TICKETS,
  SCREENINGS,
} from '@/modules/screenings/tests/utils/repository';
import { USERS } from '@/modules/users/tests/utils/repository';
import {
  INSERTABLE_TICKETS,
  INVALID_INSERTABLE_TICKET,
  TICKETS,
} from './utils/repository';
import { ERROR_NO_TICKETS_LEFT } from '@/helpers/constants';

const db = await createTestDatabase();
const app = createApp(db);

const createMovies = createFor(db, 'movies');
const createScreenings = createFor(db, 'screenings');
const createUsers = createFor(db, 'users');
const createTickets = createFor(db, 'tickets');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('tickets').execute();
  await db.deleteFrom('users').execute();
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('movies').execute();
});

describe('GET', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
    await createUsers(USERS);
    await createTickets(TICKETS);
  });

  it('Should return all the booked tickets', async () => {
    const { body } = await supertest(app).get('/tickets').expect(200);
    expect(body).toHaveLength(TICKETS.length);
    expect(body).toEqual(TICKETS);
  });
});

describe('POST', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
    await createUsers(USERS);
  });

  it('Allows posting when there are tickets left', async () => {
    const { body } = await supertest(app)
      .post('/tickets')
      .send(INSERTABLE_TICKETS[0])
      .expect(201);
    expect(body).toEqual({
      id: Math.max(...TICKETS.map((t) => t.id)) + 1,
      ...INSERTABLE_TICKETS[0],
      ...body,
    });
  });

  it('Gives an error when no tickets left', async () => {
    await createScreenings(SCREENING_WITH_NO_TICKETS);

    const { body } = await supertest(app)
      .post('/tickets')
      .send(INVALID_INSERTABLE_TICKET)
      .expect(400);

    expect(body).toEqual({
      error: ERROR_NO_TICKETS_LEFT,
    });
  });
});
