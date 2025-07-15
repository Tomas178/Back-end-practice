import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import {
  INSERTABLE_MOVIES,
  MOVIES,
} from '@/modules/screenings/tests/utils/repository';

// Testing with a real database, fine for read-only tests, as we would not
// want to pollute the database with test data, as then we need to clean it up.
// To make sure we are not modifying anything in a real database, we are using
// a read-only connection.
const db = await createTestDatabase();

// We could also easily use an in-memory database here, but then we would need
// to provide some test data
// const db = await createTestDatabase()

const app = createApp(db);

const createMovies = createFor(db, 'movies');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('movies').execute();
});

describe('GET', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
  });

  it('should return all movies if no ids are provided', async () => {
    const { body } = await supertest(app).get('/movies').expect(200);

    expect(body).toHaveLength(MOVIES.length);
  });

  it('should return movies by a list of query params', async () => {
    const { body } = await supertest(app)
      .get(`/movies?id=${MOVIES[0].id}, ${MOVIES[1].id}`)
      .expect(200);

    expect(body).toHaveLength(2);

    expect(body).toEqual([MOVIES[0], MOVIES[1]]);
  });
});

describe('POST', () => {
  it('Should successfully post one movie', async () => {
    const addedMovie = await supertest(app)
      .post('/movies')
      .send(INSERTABLE_MOVIES[0])
      .expect(201);
    expect(addedMovie.body).toEqual({
      id: Math.max(...MOVIES.map((mv) => mv.id)) + 1,
      ...INSERTABLE_MOVIES[0],
    });
  });
});
