import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { USERS } from '@/modules/users/tests/utils/repository';
import {
  MOVIES,
  SCREENINGS,
} from '@/modules/screenings/tests/utils/repository';
import { INSERTABLE_TICKETS, TICKETS } from './utils/repository';
import buildRepository from '../repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createUsers = createFor(db, 'users');
const createMovies = createFor(db, 'movies');
const createScreenings = createFor(db, 'screenings');
const createTickets = createFor(db, 'tickets');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('tickets').execute();
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('movies').execute();
  await db.deleteFrom('users').execute();
});

describe('Tickets returns', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
    await createUsers(USERS);
    await createTickets(TICKETS);
  });

  it('Should return all booked tickets', async () => {
    const tickets = await repository.findAll();
    expect(tickets).toEqual(TICKETS);
  });

  it('Should return booked ticked by id', async () => {
    const ticket = await repository.findById(TICKETS[0].id);
    expect(ticket).toEqual(TICKETS[0]);
  });
});

describe('Tickets adding', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
    await createUsers(USERS);
  });

  it('Should allow to add booked tickets', async () => {
    const ticket = await repository.create(INSERTABLE_TICKETS[0]);
    expect(ticket).toEqual({
      id: Math.max(...TICKETS.map((t) => t.id)) + 1,
      ...INSERTABLE_TICKETS[0],
      createdAt: ticket.createdAt,
    });
  });
});
