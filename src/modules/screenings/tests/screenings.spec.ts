import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import createApp from '@/app';
import { INSERTABLE_SCREENINGS, MOVIES, SCREENINGS } from './utils/repository';
import { RowSelect as ScreeningSelect } from '../repository';

const db = await createTestDatabase();

const app = createApp(db);

const createMovies = createFor(db, 'movies');
const createScreenings = createFor(db, 'screenings');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('movies').execute();
});

describe('GET', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
  });

  it('Should return all the screenings in the database', async () => {
    const { body } = await supertest(app).get('/screenings').expect(200);
    expect(body).toHaveLength(SCREENINGS.length);
  });

  it('Should return all the screenings in the database by providing IDs in query', async () => {
    const { body } = await supertest(app)
      .get(`/screenings?id=${SCREENINGS[0].id},${SCREENINGS[1].id}`)
      .expect(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual([SCREENINGS[0], SCREENINGS[1]]);
  });

  it('Should return screening by an ID given in URL', async () => {
    const { body } = await supertest(app)
      .get(`/screenings/${SCREENINGS[0].id}`)
      .expect(200);
    expect(body).toEqual(SCREENINGS[0]);
  });
});

describe('POST', () => {
  beforeEach(async () => {
    createMovies(MOVIES);
  });

  it('Successfully posts one screening', async () => {
    const addedScreening: ScreeningSelect = (
      await supertest(app)
        .post('/screenings')
        .send(INSERTABLE_SCREENINGS[0])
        .expect(201)
    ).body;
    expect(addedScreening).toEqual({
      id: Math.max(...SCREENINGS.map((sc) => sc.id)) + 1,
      ...INSERTABLE_SCREENINGS[0],
      createdAt: addedScreening.createdAt,
    });
  });
});
