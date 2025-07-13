import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { MOVIES } from './utils/repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('movies').execute();
});

describe('Screenings returns', () => {
  it('should return all existing screenings', async () => {
    await createMovies([MOVIES[0]]);

    await createScreenings([
      {
        id: 1,
        movieId: MOVIES[0].id,
        totalTickets: 1000,
        leftTickets: 1000,
        createdAt: '2025-07-13',
      },
    ]);

    const screenings = await repository.findAll();

    expect(screenings).toEqual([
      {
        id: 1,
        movieId: MOVIES[0].id,
        totalTickets: 1000,
        leftTickets: 1000,
        createdAt: '2025-07-13',
      },
    ]);
  });

  it('Returns screenings by their IDs', async () => {
    await createMovies(MOVIES);
    await createScreenings([
      {
        id: 1,
        movieId: MOVIES[0].id,
        totalTickets: 500,
        leftTickets: 500,
        createdAt: '2025-07-13',
      },
      {
        id: 26,
        movieId: MOVIES[1].id,
        totalTickets: 250,
        leftTickets: 140,
        createdAt: '2025-04-13',
      },
      {
        id: 50,
        movieId: MOVIES[2].id,
        totalTickets: 1000,
        leftTickets: 26,
        createdAt: '2025-05-26',
      },
    ]);

    const screenings = await repository.findByIds([1, 50, 26]);

    expect(screenings).toEqual([
      {
        id: 1,
        movieId: MOVIES[0].id,
        totalTickets: 500,
        leftTickets: 500,
        createdAt: '2025-07-13',
      },
      {
        id: 26,
        movieId: MOVIES[1].id,
        totalTickets: 250,
        leftTickets: 140,
        createdAt: '2025-04-13',
      },
      {
        id: 50,
        movieId: MOVIES[2].id,
        totalTickets: 1000,
        leftTickets: 26,
        createdAt: '2025-05-26',
      },
    ]);
  });
});
